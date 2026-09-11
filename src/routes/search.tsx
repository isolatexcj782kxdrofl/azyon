import { GameList } from "../components/GameList";
import { games } from "../util/games";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PiMagnifyingGlassBold } from "react-icons/pi";

export const Route = createFileRoute("/search")({
  component: Search
});

function Search() {
  const query = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();
  const results = normalizedQuery
    ? games.filter((game) => {
        return (
          game.title.toLowerCase().includes(normalizedQuery) ||
          game.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        );
      })
    : [];

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-5 py-12 md:px-16 lg:px-32 xl:px-48"
    >
      <section className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-primary">
          Game library
        </p>
        <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl">
          Search games
        </h1>
        <form method="GET" action="/search" className="relative mb-12">
          <PiMagnifyingGlassBold className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent-primary" />
          <input
            name="q"
            defaultValue={query}
            autoFocus
            placeholder="Try a game title or genre..."
            className="w-full rounded-xl border border-text-primary/15 bg-bg-secondary px-11 py-4 text-base text-text-primary shadow-lg outline-none placeholder:text-text-secondary/70 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/40"
          />
        </form>
        {query ? (
          <>
            <p className="mb-5 text-sm text-text-secondary">
              {results.length} result{results.length === 1 ? "" : "s"} for
              <span className="font-bold text-text-primary"> {query}</span>
            </p>
            {results.length > 0 ? (
              <GameList title="Matching games" games={results} />
            ) : (
              <div className="glass-panel rounded-xl px-5 py-8 text-center text-text-secondary">
                No games matched that search. Try a different title or tag.
              </div>
            )}
          </>
        ) : (
          <div className="glass-panel rounded-xl px-5 py-8 text-center text-text-secondary">
            Search by title or tag to find your next game.
          </div>
        )}
      </section>
    </motion.main>
  );
}
