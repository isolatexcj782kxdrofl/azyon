import { Image } from "./Image";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { backendUrl } from "../util/backend";

export function GameCard({
  game,
  disableHoverScale = false
}: {
  game: Game;
  disableHoverScale?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <Link
      to="/game/$gameid"
      params={{ gameid: game.id }}
      preload="intent"
      className="game-card-link group block w-[14.5rem] cursor-pointer sm:w-[15.5rem]"
      onClick={() => navigate({ to: `/game/${game.id}` })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative aspect-[1.48] overflow-hidden rounded-2xl border border-text-primary/10 bg-bg-secondary shadow-lg transition-all duration-300 group-hover:border-accent-primary/40 group-hover:shadow-2xl group-hover:shadow-accent-primary/10 group-focus-visible:ring-2 group-focus-visible:ring-accent-primary ${
          disableHoverScale ? "" : "group-hover:scale-[1.025]"
        }`}
      >
        <div className="absolute h-full w-full animate-pulse bg-bg-secondary" />
        <Image
          className="absolute left-0 top-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={backendUrl(`/game-assets/${game.id}/thumbnail.png`)}
          fallbackSrc="/game-placeholder.svg"
          alt={game.title}
        />
        <div
          className="card-overlay absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/10 to-bg-primary/95 px-3 py-2.5"
        >
          <div className="card-caption absolute bottom-2.5 left-3 right-3">
            <p className="card-title line-clamp-1 text-base font-bold">{game.title}</p>
          <div
            className={`card-tags mt-2 flex gap-1.5 overflow-hidden ${hovered ? "is-visible" : ""}`}
          >
            {(game.tags.length ? game.tags : ["uncategorized"]).map(
              (tag, i) => (
                <span
                  key={i}
                  role="link"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate({ to: `/tag/${tag}` });
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      navigate({ to: `/tag/${tag}` });
                    }
                  }}
                  className="whitespace-nowrap rounded-full bg-accent-secondary/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105"
                >
                  {tag}
                </span>
              )
            )}
          </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
