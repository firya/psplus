import GameModel, { IGame } from "../models/games";
import { markdownEscape } from "../utils/markdown";

export interface IGameData {
  id: number;
  name: string;
  from: number;
  to: number;
  acessType: string;
  tier: string;
}

export const getGameList = async (): Promise<IGameData[]> => {
  const games = await GameModel.find({ plus: { $exists: 1 } });

  return games.map((game) => gameToObject(game));
};

export const searchGame = async (
  search: string = ""
): Promise<IGameData | {}> => {
  if (search.length === 0) return {};

  const game = await GameModel.findOne({
    name: { $regex: search, $options: "i" },
  });

  return game ? gameToObject(game) : {};
};

export const gameToObject = (game: IGame): IGameData => {
  return {
    id: game.id,
    name: game.name,
    from: game.plus.from,
    to: game.plus.to,
    acessType: game.plus.acessType,
    tier: game.plus.tier,
  };
};

export const gameToMarkdown = (game: IGameData): string => {
  const baseUrl = "https://store.playstation.com/concept/";
  const name = markdownEscape(game.name);
  return `[${name}](${baseUrl}${game.id})`;
};
