import { Composer } from "telegraf";
import { getGameList, gameToMarkdown } from "../../components/games";
import sendLongMessage from "../middlewares/sendLongMessage";

import { dayBetween } from "../../utils/date";

export default {
  help: "/getnew <days> — Show a list of new games for last <days> (default: 7)",
  run: Composer.command("/getnew", async (ctx) => {
    const args = ctx.state.command.splitArgs;
    const MAX_DAYS = args[0] || 7;
    const gameList = await getGameList();

    var dateFrom: Date = new Date();
    dateFrom.setDate(dateFrom.getDate() - MAX_DAYS);

    const newGames = gameList.filter(
      (game) => game.tier && game.from > dateFrom.getTime()
    );

    let message = "❌ No new games for last " + MAX_DAYS + " days";
    if (newGames.length > 0) {
      message = `🎮 Expiring games:\n${newGames
        .map((game, i) => {
          const remainDays = dayBetween(game.from, Date.now());
          return `${i + 1}\\. ${gameToMarkdown(
            game,
            true
          )} \— \\(${remainDays} ${remainDays === 1 ? "day" : "days"}\\)`;
        })
        .join("\n")}`;
    }

    sendLongMessage(ctx.update.message.from.id, message);
  }),
};
