import { games } from "../../util/games";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
import { backendUrl } from "../../util/backend";
  PiCornersInBold,
  PiCornersOutBold,
  PiHeartBold,
  PiHeartFill
} from "react-icons/pi";

export const Route = createFileRoute("/game/$gameid")({
  component: RouteComponent
});

function RouteComponent() {
  const { gameid } = Route.useParams();
  const game = games.find((game) => game.id === gameid);
  const [fullscreen, setFullscreen] = useState(false);
  const [favorited, setFavorited] = useState(false);
  // const [liked, setLiked] = useState(true);
  // const [disliked, setDisliked] = useState(false);

  if (!game) {
    throw redirect({ to: "/" });
  }

  useEffect(() => {
    const favorites = (localStorage.getItem("favorites") ?? "")
      .split(",")
      .filter((id) => id !== "");
    setFavorited(favorites.includes(game.id));

    const recentGames = (localStorage.getItem("recentGames") ?? "")
      .split(",")
      .filter((id) => id !== "" && id !== game.id);
    localStorage.setItem("recentGames", [game.id, ...recentGames].slice(0, 12).join(","));

    const handleKeypress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      document.exitFullscreen();
      setFullscreen(false);
    }
    };

    const handleFullscreenChange = () => {
      setFullscreen(document.fullscreenElement !== null);
    };

    const handleGameKeydown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keypress", handleKeypress);
    window.addEventListener("keydown", handleGameKeydown, { passive: false });
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keypress", handleKeypress);
      window.removeEventListener("keydown", handleGameKeydown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [game.id]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col justify-center px-8 md:px-16 lg:px-32 xl:px-48"
    >
      <div className="flex w-full flex-col overflow-hidden rounded-lg bg-bg-secondary shadow-lg">
        <iframe
          id="game"
          scrolling="no"
          title={game.title}
          tabIndex={0}
          allow="fullscreen; pointer-lock"
          src={backendUrl(`/game-assets/${game.id}/index.html`)}
          onPointerDown={(event) => {
            event.currentTarget.focus();
          }}
          className="aspect-video w-full border-0 outline-none [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen]:max-w-none [&:fullscreen]:aspect-auto"
          src={`/game-assets/${game.id}/index.html`}
        ></iframe>
        <div className="flex justify-between gap-2 p-5 pb-0">
          <div className="flex flex-col">
            <p className="text-sm">{game.author}</p>
            <h1 className="mb-1 text-2xl font-bold">{game.title}</h1>
            <div className="flex gap-2">
              {game.tags.map((tag) => {
                return (
                  <a
                    className="inset-0 whitespace-nowrap rounded bg-accent-secondary p-1 text-xs font-bold uppercase tracking-wide transition-all hover:scale-110"
                    href={`/tag/${tag}`}
                  >
                    {tag}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2 text-2xl">
            {/* <span>{liked ? <PiThumbsUpFill /> : <PiThumbsUpBold />}</span>
            <span>
              {disliked ? <PiThumbsDownFill /> : <PiThumbsDownBold />}
            </span> */}
            <button
              type="button"
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
              className={`rounded-lg p-1 transition hover:bg-bg-primary/50 hover:text-accent-primary ${
                favorited ? "text-accent-primary" : ""
              }`}
              onClick={() => {
                const favorites = (localStorage.getItem("favorites") ?? "")
                  .split(",")
                  .filter((id) => id !== "");

                if (favorited) {
                  const nextFavorites = favorites.filter((id) => id !== game.id);
                  localStorage.setItem("favorites", nextFavorites.join(","));
                  setFavorited(false);
                } else {
                  if (!favorites.includes(game.id)) favorites.push(game.id);
                  localStorage.setItem("favorites", favorites.join(","));
                  setFavorited(true);
                }
              }}
            >
              {favorited ? <PiHeartFill /> : <PiHeartBold />}
            </button>
            <button
              type="button"
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="rounded-lg p-1 transition hover:bg-bg-primary/50 hover:text-accent-primary"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.getElementById("game")!.requestFullscreen();
                }
              }}
            >
              {fullscreen ? <PiCornersInBold /> : <PiCornersOutBold />}
            </button>
          </div>
        </div>
        <p className="mb-2 px-5 py-3">{game.description}</p>
      </div>
    </motion.main>
  );
}
