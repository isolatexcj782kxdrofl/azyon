import { GameCard } from "./GameCard";
import { useState } from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

export function GameRow(props: { games: Game[]; disableCardScale?: boolean }) {
  const [elm, setElm] = useState<HTMLDivElement | null>(null);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative -mx-2 rounded-lg px-2 py-3">
      <div
        className={`absolute left-0 z-[1] flex h-full w-16 items-center justify-center bg-gradient-to-r from-bg-primary to-transparent text-lg ${
          isStart ? "pointer-events-none opacity-0" : "opacity-100"
        } transition-all`}
      >
        <button
          type="button"
          aria-label="Scroll left"
          className="rounded-full bg-bg-secondary/80 p-2 shadow-lg transition hover:scale-110 hover:text-accent-primary"
          onClick={() => {
            if (elm) {
              elm.scrollLeft -= elm.offsetWidth;
            }
          }}
        >
          <PiCaretLeftBold />
        </button>
      </div>
      <div
        className={`absolute right-0 z-[1] flex h-full w-16 items-center justify-center bg-gradient-to-l from-bg-primary to-transparent text-lg ${
          isEnd ? "pointer-events-none opacity-0" : "opacity-100"
        } transition-all`}
      >
        <button
          type="button"
          aria-label="Scroll right"
          className="rounded-full bg-bg-secondary/80 p-2 shadow-lg transition hover:scale-110 hover:text-accent-primary"
          onClick={() => {
            if (elm) {
              elm.scrollLeft += elm.offsetWidth;
            }
          }}
        >
          <PiCaretRightBold />
        </button>
      </div>
      <div
        className="scrollbar-none relative flex h-fit w-full flex-row items-center justify-start gap-5 overflow-x-auto scroll-smooth"
        ref={(elm) => {
          if (elm) {
            setElm(elm);

            setIsStart(elm.scrollLeft === 0);
            setIsEnd(elm.scrollLeft === elm.scrollWidth - elm.offsetWidth);

            elm.addEventListener("scroll", () => {
              setIsStart(elm.scrollLeft === 0);
              setIsEnd(elm.scrollLeft === elm.scrollWidth - elm.offsetWidth);
            });
          }
        }}
      >
        {props.games.map((game) => (
          <div className="shrink-0" key={game.id}>
            <GameCard game={game} disableHoverScale={props.disableCardScale} />
          </div>
        ))}
      </div>
    </div>
  );
}
