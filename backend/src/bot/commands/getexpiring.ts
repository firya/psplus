import { Composer } from "telegraf";
import { getGameList, gameToMarkdown } from "../../components/games";
import sendLongMessage from "../middlewares/sendLongMessage";

import { dayBetween } from "../../utils/date";

export default {
  help: "/getexpiring <days> — Show a list of gamesexpiring on the specified number of days (default: 30)",
  run: Composer.command("/getexpiring", async (ctx) => {
    const args = ctx.state.command.splitArgs;
    const MAX_DAYS = args[0] || 30;
    const gameList = await getGameList();

    const expiringGames = gameList.filter((game) => {
      console.log(game.name, game.tier, game.to);
      return (
        game.tier && game.to && dayBetween(Date.now(), game.to) <= MAX_DAYS
      );
    });

    let message = "❌ No games expiring in the next " + MAX_DAYS + " days";
    if (expiringGames.length > 0) {
      message = `🎮 Expiring games:\n${expiringGames
        .map(
          (game, i) =>
            `${i + 1}\\. ${gameToMarkdown(game, true)} \— \\(${dayBetween(
              Date.now(),
              game.to
            )} days\\)`
        )
        .join("\n")}`;
    }

    sendLongMessage(ctx.update.message.from.id, message);
  }),
};
