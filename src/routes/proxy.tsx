import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, Reorder } from "motion/react";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiExternalLink,
  FiMaximize,
  FiPlus,
  FiRotateCw,
  FiX
} from "react-icons/fi";

export type Tab = {
  id: number;
  title: string;
  favicon: string;
  url: string;
};

export const Route = createFileRoute("/proxy")({
  component: RouteComponent
});

function RouteComponent() {
  const [transportReady, setTransportReady] = useState(Boolean(window.Connection));
  const [tabs, setTabs] = useState<Tab[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("tabs") || "[]");
    } catch {
      localStorage.removeItem("tabs");
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<number>(
    Number(localStorage.getItem("activeTab")!) || 0
  );
  const [inputValue, setInputValue] = useState<string | null>(null);
  // console.log("REF: ", document.referrer);
  function addTab(url: string): number {
    const tab = {
      id: Math.floor(Math.random() * 1000000),
      title: url,
      favicon: "https://www.google.com/s2/favicons?domain=duckduckgo.com",
      url
    };
    setTabs((currentTabs) => [...currentTabs, tab]);
    setActiveTab(tab.id);
    setInputValue(null);

    return tab.id;
  }

  function addFrame(tab: Tab) {
    const iframe = document.createElement("iframe");
    // @ts-expect-error scram
    iframe.src = scram.encodeUrl(tab.url);
    iframe.id = tab.id.toString();
    iframe.className = "absolute inset-x-0 bottom-0 top-[4.5rem] h-auto w-full border-0 bg-white";
    document.getElementById("frames")!.appendChild(iframe);
  }

  function removeTab(id: number) {
    const iframe = document.getElementById(id.toString());
    if (iframe) {
      iframe.remove();
    }

    const oldActiveTab = activeTab;
    if (oldActiveTab === id) {
      const remainingTabs = tabs.filter((x) => x.id !== id);
      setTabs(remainingTabs);
      setActiveTab(remainingTabs[0]?.id ?? 0);
      setInputValue(null);
    } else {
      setTabs(tabs.filter((x) => x.id !== id));
    }
  }

  function redirect(id: number, query: string) {
    const tab = tabs.find((x) => x.id === id)!;

    let url;
    if (/^https?:\/\//.test(query)) {
      url = query;
    } else if (/^.+\..+/.test(query)) {
      url = `https://${query}`;
    } else {
      url = `https://duckduckgo.com/?q=${query}`;
    }

    tab.url = url;

    const iframe = document.getElementById(id.toString()) as HTMLIFrameElement;
    //@ts-expect-error scram
    iframe.src = scram.encodeUrl(url);

    const index = tabs.findIndex((x) => x.id === id);

    setTabs((currentTabs) => [
      ...currentTabs.slice(0, index),
      tab,
      ...currentTabs.slice(index + 1)
    ]);
  }

  useEffect(() => {
    if (!transportReady) {
      const readyCheck = window.setInterval(() => {
        if (window.Connection) {
          setTransportReady(true);
          window.clearInterval(readyCheck);
        }
      }, 100);

      return () => window.clearInterval(readyCheck);
    }

    if (tabs.length === 0) {
      addTab("https://duckduckgo.com/");
      return;
    }

    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
      return;
    }

    tabs.forEach((tab) => {
      if (!document.getElementById(tab.id.toString())) addFrame(tab);
    });

    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.style.display = "none";
    });
    const iframe = document.getElementById(activeTab.toString());
    if (iframe) {
      iframe.style.display = "block";
    }
  }, [transportReady, tabs, activeTab]);

  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
    localStorage.setItem("activeTab", activeTab.toString());
  }, [tabs, activeTab]);

  useEffect(() => {
    const iframe = document.getElementById(
      activeTab.toString()
    ) as HTMLIFrameElement;

    const interval = setInterval(() => {
      if (!iframe || !iframe.contentWindow) return;
      if (iframe.contentWindow.location.href === "about:blank") return;
      const title = iframe.contentDocument!.title;
      // @ts-expect-error scram
      const url = scram.decodeUrl(
        location.origin + iframe.contentWindow!.location.pathname
      );
      const favicon =
        iframe.contentDocument!.querySelector<HTMLLinkElement>(
          "link[rel='shortcut icon'], link[rel='icon']"
        )?.href ?? new URL(url).origin + "/favicon.ico";

      const tab = tabs.find((x) => x.id === activeTab)!;

      if (tab?.title !== title) {
        tab.title = title;
      }

      if (tab?.favicon !== favicon) {
        tab.favicon = favicon!;
      }

      if (tab?.url !== url) {
        tab.url = url;
      }

      const tabIndex = tabs.findIndex((x) => x.id === activeTab);

      setTabs([...tabs.slice(0, tabIndex), tab, ...tabs.slice(tabIndex + 1)]);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activeTab]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex h-full w-full select-none overflow-hidden bg-[#11151c]"
    >
      <div className="flex h-full w-16 flex-col border-r border-white/10 bg-[#171c25] shadow-2xl transition-all sm:w-72">
        <div className="flex h-16 w-full items-center justify-center border-b border-white/10 bg-[#11151c]">
          <a href="/">
            <span className="hidden text-lg font-black tracking-[0.14em] text-white sm:inline">AZYON <span className="text-accent-primary">/ WEB</span></span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-primary/60 bg-accent-primary/15 font-black text-accent-primary sm:hidden">A</span>
          </a>
        </div>
        <Reorder.Group
          as="div"
          axis="y"
          onReorder={(newTabs: Tab[]) => {
            setTabs(newTabs);
          }}
          values={tabs}
          className="scrollbar-none flex w-full flex-1 flex-col items-center gap-2 overflow-y-scroll p-3 transition-none sm:p-4"
        >
          <AnimatePresence>
            {tabs.map((tab) => {
              return (
                <Reorder.Item
                  key={tab.id}
                  value={tab}
                  as="div"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1
                  }}
                  transition={{
                    duration: 0.1
                  }}
                  className={`flex aspect-square h-11 w-11 items-center justify-center rounded-xl border border-transparent p-2 text-sm transition-all sm:h-auto sm:min-h-11 sm:w-full sm:justify-normal sm:gap-2 ${
                    tab.id === activeTab
                      ? "border-accent-primary/50 bg-accent-primary/10 text-white shadow-lg shadow-black/20"
                      : "border-white/5 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.07]"
                  }`}
                  onMouseDown={() => {
                    setActiveTab(tab.id);
                    setInputValue(null);
                  }}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${tab.url}`}
                    className="h-5 w-5 rounded-md"
                    draggable={false}
                  ></img>
                  <span className="hidden flex-1 truncate whitespace-nowrap text-sm font-semibold sm:block">
                    {tab.title}
                  </span>
                  <button
                    type="button"
                    aria-label={`Close ${tab.title}`}
                    className="rounded-md p-1 text-white/40 transition hover:bg-white/10 hover:text-white sm:block"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTab(tab.id);
                    }}
                  >
                    <FiX />
                  </button>
                </Reorder.Item>
              );
            })}
          </AnimatePresence>
        </Reorder.Group>
        <div className="flex h-16 w-full items-center justify-end border-t border-white/10 p-4 text-xl">
          <button
            type="button"
            aria-label="New tab"
            className="rounded-lg border border-accent-primary/50 bg-accent-primary/15 p-2 text-accent-primary transition hover:bg-accent-primary hover:text-[#11151c]"
            onClick={() => {
              addTab("https://duckduckgo.com");
            }}
          >
            <FiPlus />
          </button>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col bg-[#0d1117]" id="frames">
        <div className="relative z-10 flex min-h-16 w-full items-center justify-center gap-2 border-b border-white/10 bg-[#171c25]/95 p-3 shadow-xl backdrop-blur-xl">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => {
              (
                document.getElementById(
                  activeTab.toString()
                ) as HTMLIFrameElement
              ).contentWindow!.history.back();
            }}
            className="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2 text-lg text-white/70 transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary"
          >
            <FiArrowLeft />
          </button>
          <button
            type="button"
            aria-label="Go forward"
            onClick={() => {
              (
                document.getElementById(
                  activeTab.toString()
                ) as HTMLIFrameElement
              ).contentWindow!.history.forward();
            }}
            className="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2 text-lg text-white/70 transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary"
          >
            <FiArrowRight />
          </button>
          <button
            type="button"
            aria-label="Reload page"
            onClick={() => {
              (
                document.getElementById(
                  activeTab.toString()
                ) as HTMLIFrameElement
              ).contentWindow!.location.reload();
            }}
            className="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2 text-lg text-white/70 transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary"
          >
            <FiRotateCw />
          </button>
          <input
            className="h-10 min-w-0 flex-1 rounded-lg border border-white/15 bg-[#0d1117] px-4 py-2 font-medium text-white shadow-inner outline-none ring-accent-primary placeholder:text-white/35 transition focus:border-accent-primary focus:ring-2"
            value={
              inputValue !== null
                ? inputValue
                : tabs.find((x) => x.id === activeTab)?.url || ""
            }
            onInput={(e) => {
              setInputValue(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                redirect(activeTab, e.currentTarget.value);
                setInputValue(null);
                e.currentTarget.blur();
              }
            }}
          ></input>
          <button
            type="button"
            aria-label="Fullscreen"
            onClick={() => {
              document
                .getElementById(activeTab.toString())!
                .requestFullscreen();
            }}
            className="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2 text-lg text-white/70 transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary"
          >
            <FiMaximize />
          </button>
          <button
            type="button"
            aria-label="Open in new tab"
            onClick={() => {
              open(
                (
                  document.getElementById(
                    activeTab.toString()
                  ) as HTMLIFrameElement
                ).contentWindow!.location.href
              );
            }}
            className="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2 text-lg text-white/70 transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary"
          >
            <FiExternalLink />
          </button>
        </div>
      </div>
    </motion.main>
  );
}

