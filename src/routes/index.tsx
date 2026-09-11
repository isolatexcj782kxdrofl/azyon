import { GameRow } from "../components/GameRow";
import { localGameIds } from "../util/localGameIds";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  PiArrowUpRightBold,
  PiGameControllerBold,
  PiSparkleBold,
  PiLightningBold
} from "react-icons/pi";

export const Route = createFileRoute("/")({
  component: Home
});

const subtitles = [
  "A hand-picked arcade for quick breaks, high scores, and one-more-round energy.",
  "Jump in fast, chase a high score, and leave whenever real life loads back in.",
  "Small games, big replay energy, and a fresh excuse to play one more round.",
  "Your next favorite game is probably one click away."
];

export function Home() {
  const [subtitleIndex, setSubtitleIndex] = useState(() =>
    Math.floor(Date.now() / (3 * 60 * 60 * 1000)) % subtitles.length
  );

  useEffect(() => {
    const updateSubtitle = () => {
      setSubtitleIndex(
        Math.floor(Date.now() / (3 * 60 * 60 * 1000)) % subtitles.length
      );
    };
    const timer = window.setInterval(updateSubtitle, 60 * 1000);
    return () => window.clearInterval(timer);
  }, [subtitles.length]);

  const { data } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      return fetch("/games.json")
        .then((res) => res.json() as Promise<Game[]>)
        .then((games) => games.filter((game) => localGameIds.has(game.id)));
    }
  });

  if (!data) return null;

  const favorites = (localStorage.getItem("favorites") ?? "")
    .split(",")
    .filter((id) => id !== "")
    .map((x) => data.find((y) => y.id === x)!)
    .filter((x) => x !== undefined);

  const recentlyPlayed = (localStorage.getItem("recentGames") ?? "")
    .split(",")
    .filter((id) => id !== "")
    .map((id) => data.find((game) => game.id === id))
    .filter((game): game is Game => game !== undefined);

  const featuredIds = [
    "slope",
    "tetris",
    "friendly-fire",
    "moto-x3m-pool-party",
    "economical",
    "retro-bowl",
    "geometry-dash-remastered",
    "run-3",
    "drift-hunters",
    "basket-random"
  ];

  const featured = featuredIds
    .map((x) => data.find((y) => y.id === x)!)
    .filter((x) => x !== undefined);

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="content-frame pb-12 pt-7 sm:pb-20 sm:pt-10"
    >
      <section className="hero-panel glass-panel relative isolate min-h-[30rem] overflow-hidden rounded-[1.75rem] shadow-2xl shadow-black/25">
        <div className="relative mx-auto flex min-h-[30rem] max-w-2xl flex-col items-center justify-center px-6 py-8 text-center sm:px-12 sm:py-12">
          <motion.div
            className="eyebrow mb-5 flex items-center gap-2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <PiSparkleBold /> Featured this week
          </motion.div>
          <h1 className="brand-glow mb-4 text-6xl font-black leading-none tracking-[0.08em] text-accent-primary sm:text-8xl">
            AZYON
          </h1>
          <p className="max-w-lg text-base leading-7 text-text-secondary sm:text-lg">
            {subtitles[subtitleIndex]}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/games" className="accent-glow flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3.5 text-sm font-black text-bg-primary transition hover:brightness-110">
              <PiLightningBold /> Play something
            </a>
            <a href="/games" className="flex items-center gap-2 rounded-full border border-text-primary/20 bg-bg-primary/40 px-5 py-3.5 text-sm font-bold backdrop-blur transition hover:border-text-primary/50">
              Explore library <PiArrowUpRightBold />
            </a>
            <a href="/proxy" className="flex items-center gap-2 rounded-full border border-accent-secondary/40 bg-accent-secondary/10 px-5 py-3.5 text-sm font-bold text-accent-secondary backdrop-blur transition hover:border-accent-secondary hover:bg-accent-secondary/20">
              Access Web / AI <PiArrowUpRightBold />
            </a>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-secondary">
            <PiGameControllerBold className="text-accent-primary" /> {data.length}+ free games / no account needed
          </div>
        </div>
      </section>

      <section className="mb-14 mt-14">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Your shelf</p>
            <h3 className="section-heading text-3xl font-black">Favorites</h3>
          </div>
            <a href="/games" className="hidden items-center gap-2 text-sm font-semibold text-text-secondary hover:text-accent-primary sm:flex">View all <PiArrowUpRightBold /></a>
        </div>
        {favorites.length > 0 ? (
          <GameRow games={favorites} disableCardScale />
        ) : (
          <p className="glass-panel rounded-xl px-5 py-4 text-sm text-text-secondary">
            Click the heart next to the full screen button in order to add a
            game to your favorites.
          </p>
        )}
      </section>

      {recentlyPlayed.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Jump back in</p>
              <h3 className="section-heading text-3xl font-black">Recently played</h3>
            </div>
            <span className="hidden text-sm text-text-secondary sm:inline">Your latest games</span>
          </div>
          <GameRow games={recentlyPlayed} disableCardScale />
        </section>
      )}

      <section className="mb-16">
        <div className="mb-4">
          <p className="eyebrow mb-2">Curated for you</p>
          <h3 className="section-heading text-3xl font-black">Featured games</h3>
        </div>
        <GameRow games={featured} disableCardScale />
        <div className="mt-8 flex justify-center">
          <a
            href="/games"
            className="group flex items-center gap-3 rounded-xl border border-text-primary/15 bg-bg-secondary/55 px-5 py-3 text-sm font-bold text-text-primary shadow-lg backdrop-blur transition hover:border-accent-primary/50 hover:bg-bg-secondary hover:text-accent-primary"
          >
            Browse hundreds more games
            <PiArrowUpRightBold className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </motion.main>
  );
}

