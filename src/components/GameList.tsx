import { GameCard } from "./GameCard";

export function GameList(props: { title: string; games: Game[] }) {
  return (
    <>
      {props.games.length > 0 && (
        <>
          <h3 className="section-heading mb-6 mt-12 text-center text-3xl font-black capitalize md:text-left">
            {props.title}
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(14.5rem,1fr))] gap-5 pb-16">
            {props.games.map((game) => {
              return <GameCard key={game.id} game={game} />;
            })}
          </div>
        </>
      )}
    </>
  );
}
