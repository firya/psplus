import { getGameList, searchGame } from "../components/games";

export const getPSplusGames = async (req, res) => {
  res.json(await getGameList());
};

export const searchPSplusGame = async (req, res) => {
  const search: string = req.query.s || "";

  res.json(await searchGame(search));
};
