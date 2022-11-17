import { Composer } from "telegraf";
import { getGameList, gameToMarkdown } from "../../components/games";
import sendLongMessage from "../middlewares/sendLongMessage";

import { dayBetween } from "../../utils/date";

export default {
  help: "/getexpiring <days> — Show a list of games expiring on the specified number of days (default: 30)",
  run: Composer.command("/getexpiring", async (ctx) => {
    const args = ctx.state.command.splitArgs;
    const MAX_DAYS = args[0] || 30;
    const gameList = await getGameList();

    const expiringGames = gameList
      .filter(
        (game) =>
          game.tier && game.to && dayBetween(Date.now(), game.to) <= MAX_DAYS
      )
      .sort((a, b) => a.from - b.from);

    let message = "❌ No games expiring in the next " + MAX_DAYS + " days";
    if (expiringGames.length > 0) {
      message = `🎮 Expiring games:\n${expiringGames
        .map((game, i) => {
          const remainDays = dayBetween(Date.now(), game.to);
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
