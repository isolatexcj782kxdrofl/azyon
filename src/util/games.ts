import gameData from "../games.json";
import { localGameIds } from "./localGameIds";

export const games = (gameData as Game[]).filter((game) =>
	localGameIds.has(game.id)
);
