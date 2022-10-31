import GameModel, { IGame } from "../models/games";
import { markdownEscape } from "../utils/markdown";

export interface IGameData {
  id: number;
  name: string;
  from: number;
  to: number;
  acessType: string;
  tier: string;
  updated: boolean;
}

export const getGameList = async (): Promise<IGameData[]> => {
  const games = await GameModel.find({
    "plus.from": { $lt: Date.now() },
    $or: [{ "plus.to": { $gt: Date.now() } }, { "plus.to": null }],
  });

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
    updated: game.plus.updated,
  };
};

export const gameToMarkdown = (
  game: IGameData,
  tier: boolean = false
): string => {
  const baseUrl = "https://store.playstation.com/en-US/concept/";
  const name = markdownEscape(game.name);
  return `[${name}](${baseUrl}${game.id}) \\(${tier ? game.tier + " " : ""}${
    game.acessType
  }\\)`;
};
