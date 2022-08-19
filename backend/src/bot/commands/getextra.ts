import { Composer } from "telegraf";
import { getGameList, gameToMarkdown } from "../../components/games";
import sendLongMessage from "../middlewares/sendLongMessage";

export default {
  help: "/getextra — Show a list of games in PS Plus Extra",
  run: Composer.command("/getextra", async (ctx) => {
    const games = await getGameList();

    const result = games.filter((game) => game.tier === "Extra");

    let message = `🎮 Extra games \\(${result.length}\\):\n${result
      .map((game, i) => `${i + 1}\\. ${gameToMarkdown(game)}`)
      .join("\n")}`;

    sendLongMessage(ctx.update.message.from.id, message);
  }),
};
