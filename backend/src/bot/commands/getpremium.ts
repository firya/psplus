import { Composer } from "telegraf";
import { getGameList, gameToMarkdown } from "../../components/games";
import sendLongMessage from "../middlewares/sendLongMessage";

export default {
  help: "/getpremium — Show a list of games in PS Plus Premium",
  run: Composer.command("/getpremium", async (ctx) => {
    const games = await getGameList();

    const result = games.filter((game) => game.tier === "Premium");

    let message = `🎮 Total games \\(${result.length}\\):\n${result
      .map((game, i) => `${i + 1}\\. ${gameToMarkdown(game)}`)
      .join("\n")}`;

    sendLongMessage(ctx.update.message.from.id, message);
  }),
};
