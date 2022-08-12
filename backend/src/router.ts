import { getPSplusGames, searchPSplusGame } from "./controller/games";

export default (app) => {
  app.route("/api/games/search").get(searchPSplusGame);
  app.route("/api/games").get(getPSplusGames);
};
