import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { themes } from "../themes";

export const Route = createFileRoute("/preferences")({
  component: RouteComponent
});

function RouteComponent() {
  const [title, setTitle] = useState(
    () => localStorage.getItem("title")?.trim() || "Azyon"
  );
  const [icon, setIcon] = useState(
    () => localStorage.getItem("icon")?.trim() || "/brand-icon.png"
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "arcade-ember"
  );
  const [reduceMotion, setReduceMotion] = useState(
    () => localStorage.getItem("reduceMotion") === "true"
  );
  const [compactCards, setCompactCards] = useState(
    () => localStorage.getItem("compactCards") === "true"
  );

  function reloadWithPreference(key: string, value: string) {
    localStorage.setItem(key, value);
    window.location.reload();
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="content-frame flex flex-col gap-6 py-10 sm:py-14"
    >
      <div>
        <p className="eyebrow mb-3">Make it yours</p>
        <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">Preferences</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">Tune the arcade to your screen, your mood, and the way you like to play.</p>
      </div>

      <section className="glass-panel rounded-2xl p-6 sm:p-8">
        <p className="eyebrow mb-2">Appearance</p>
        <h2 className="text-2xl font-black tracking-tight">Set the atmosphere</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-semibold sm:col-span-2">
            Color theme
            <select
              className="rounded-xl border border-text-primary/20 bg-bg-primary px-3 py-3 text-base text-text-primary shadow-inner outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/40"
              value={theme}
              onChange={(event) => {
                setTheme(event.currentTarget.value);
                reloadWithPreference("theme", event.currentTarget.value);
              }}
            >
              <option value="arcade-ember">Arcade Ember</option>
              {themes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <div className="rounded-xl border border-text-primary/10 bg-bg-primary/35 p-4 text-sm text-text-secondary">
            <span className="mb-2 block font-bold text-text-primary">Theme preview</span>
            <span className="flex gap-2"><i className="h-5 w-5 rounded-full bg-accent-primary" /><i className="h-5 w-5 rounded-full bg-accent-secondary" /><i className="h-5 w-5 rounded-full bg-bg-secondary" /></span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-text-primary/10 bg-bg-primary/25 p-4 text-sm font-semibold">
            <span><span className="block">Reduce motion</span><span className="mt-1 block text-xs font-normal text-text-secondary">Keep transitions calm and minimal.</span></span>
            <input type="checkbox" checked={reduceMotion} onChange={(event) => { setReduceMotion(event.currentTarget.checked); reloadWithPreference("reduceMotion", String(event.currentTarget.checked)); }} className="h-5 w-5 accent-accent-primary" />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-text-primary/10 bg-bg-primary/25 p-4 text-sm font-semibold">
            <span><span className="block">Compact cards</span><span className="mt-1 block text-xs font-normal text-text-secondary">Fit more games on each row.</span></span>
            <input type="checkbox" checked={compactCards} onChange={(event) => { setCompactCards(event.currentTarget.checked); reloadWithPreference("compactCards", String(event.currentTarget.checked)); }} className="h-5 w-5 accent-accent-primary" />
          </label>
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-6 sm:p-8">
        <p className="eyebrow mb-2">Personalize your tab</p>
        <h2 className="text-2xl font-black tracking-tight">Tab cloaking</h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-text-secondary">
          Change the title and icon shown in your browser tab. Updates apply as you type.
        </p>

        <div className="mx-auto mt-8 grid max-w-2xl gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Page title
            <input
              className="rounded-xl border border-text-primary/20 bg-bg-primary px-3 py-3 text-base text-text-primary shadow-inner outline-none placeholder:text-text-secondary/70 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/40"
              onChange={(e) => {
                const nextTitle = e.currentTarget.value;
                setTitle(nextTitle);
                document.title = nextTitle.trim() || "Azyon";
                localStorage.setItem("title", nextTitle);
              }}
              value={title}
              placeholder="Azyon"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Page icon URL
            <input
              className="rounded-xl border border-text-primary/20 bg-bg-primary px-3 py-3 text-base text-text-primary shadow-inner outline-none placeholder:text-text-secondary/70 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/40"
              onChange={(e) => {
                const nextIcon = e.currentTarget.value;
                setIcon(nextIcon);

                document.querySelector<HTMLLinkElement>(
                  'link[rel="icon"]'
                )!.href = nextIcon.trim() || "/brand-icon.png";
                localStorage.setItem("icon", nextIcon);
              }}
              value={icon}
              placeholder="/favicon.ico"
            />
          </label>
        </div>
      </section>
    </motion.main>
  );
}

