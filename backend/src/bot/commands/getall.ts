import { Composer } from "telegraf";
import { getGameList, gameToMarkdown } from "../../components/games";
import sendLongMessage from "../middlewares/sendLongMessage";

export default {
  help: "/getall — Show a list of all games",
  run: Composer.command("/getall", async (ctx) => {
    const games = await getGameList();

    const result = games.reduce((acc, game) => {
      if (!acc[game.tier]) acc[game.tier] = [];
      acc[game.tier].push(game);
      return acc;
    }, {});

    let message = `Total games: ${games.length}\n🎮 Extra games \\(${
      result["Extra"].length
    }\\):\n
    ${result["Extra"]
      .map((game, i) => `${i + 1}\\. ${gameToMarkdown(game)}`)
      .join("\n")}\n🎮 Premium games \\(${
      result["Premium"].length
    }\\):\n${result["Premium"]
      .map((game, i) => `${i + 1}\\. ${gameToMarkdown(game)}`)
      .join("\n")}`;

    sendLongMessage(ctx.update.message.from.id, message);
  }),
};
