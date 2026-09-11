import { GameList } from "../components/GameList";
import { games } from "../util/games";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/games")({
  component: RouteComponent
});

function RouteComponent() {
  const tags = Array.from(new Set(games.flatMap((game) => game.tags))).slice(0, 8);

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="content-frame pb-12 pt-10 sm:pt-14"
    >
      <section className="glass-panel mb-10 rounded-2xl px-6 py-8 sm:px-10">
        <p className="eyebrow mb-3">The arcade shelf</p>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Find your next game.</h1>
            <p className="max-w-xl text-sm leading-6 text-text-secondary">Browse quick hits, classics, and strange little gems. Pick a lane or let the whole library surprise you.</p>
          </div>
          <span className="shrink-0 text-sm font-bold text-accent-primary">{games.length} games ready</span>
        </div>
      </section>
      <div className="mb-8 flex flex-wrap gap-2">
        <a href="/games" className="rounded-full bg-accent-primary px-4 py-2 text-xs font-black uppercase tracking-wider text-bg-primary">All games</a>
        {tags.map((tag) => <a key={tag} href={`/tag/${tag}`} className="rounded-full border border-text-primary/15 bg-bg-secondary/45 px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-secondary transition hover:border-accent-primary/50 hover:text-accent-primary">{tag}</a>)}
      </div>
      <GameList title="All Games" games={games} />
    </motion.main>
  );
}

