import sendLongMessage from "../bot/middlewares/sendLongMessage";
import { getGameList, gameToMarkdown } from "../components/games";
import Users from "../models/users";
import { dayBetween } from "../utils/date";

export const sendReport = async () => {
  const DAY_BEFORE = [14, 30];
  const gameList = await getGameList();

  var todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const newGames = gameList.filter(
    (game) => game.tier && game.from > todayMidnight.getTime()
  );

  const expiringGames = gameList.filter(
    (game) =>
      game.tier &&
      game.to &&
      DAY_BEFORE.includes(dayBetween(Date.now(), game.to))
  );

  let message = "";
  if (newGames.length > 0) {
    message += `New games:\n${newGames
      .map((game, i) => `${i + 1}\\. ${gameToMarkdown(game)}`)
      .join("\n")}`;
  }
  if (expiringGames.length > 0) {
    if (message.length > 0) message += "\n\n";
    message += `Expiring games:\n${expiringGames
      .map(
        (game, i) =>
          `${i + 1}\\. ${gameToMarkdown(game)} \— \\(${dayBetween(
            Date.now(),
            game.to
          )} days\\)`
      )
      .join("\n")}`;
  }

  if (message.length > 0) {
    const userList = await Users.find({ "report.on": true });

    userList.forEach((user) => {
      sendLongMessage(user.id, message);
    });
  }
};
