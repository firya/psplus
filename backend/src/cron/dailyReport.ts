import sendLongMessage from "../bot/middlewares/sendLongMessage";
import { getGameList, gameToMarkdown, IGameData } from "../components/games";
import Users, { IUser } from "../models/users";
import { dayBetween } from "../utils/date";

export const sendReport = async () => {
  let message: string = await prepareReport();

  if (message.length > 0) {
    const userList: IUser[] = await Users.find({ "report.on": true });

    userList.forEach((user) => {
      sendLongMessage(user.id, message);
    });
  }
};

export const prepareReport = async (): Promise<string> => {
  const DAY_BEFORE: number[] = [14, 30];
  const gameList: IGameData[] = await getGameList();

  var yesterdayReportTime: Date = new Date();
  yesterdayReportTime.setDate(yesterdayReportTime.getDate() - 1);
  yesterdayReportTime.setHours(10, 0, 0, 0);

  const newGames: IGameData[] = gameList.filter(
    (game) => game.tier && game.from > tomorrowReportTime.getTime()
  );

  const expiringGames: IGameData[] = gameList.filter(
    (game) =>
      game.tier &&
      game.to &&
      DAY_BEFORE.includes(dayBetween(Date.now(), game.to))
  );

  let message: string = "";
  if (newGames.length > 0) {
    message += `New games:\n${newGames
      .map((game, i) => `${i + 1}\\. ${gameToMarkdown(game, true)}`)
      .join("\n")}`;
  }
  if (expiringGames.length > 0) {
    if (message.length > 0) message += "\n\n";
    message += `Expiring games:\n${expiringGames
      .map(
        (game, i) =>
          `${i + 1}\\. ${gameToMarkdown(game, true)} \— \\(${dayBetween(
            Date.now(),
            game.to
          )} days\\)`
      )
      .join("\n")}`;
  }

  return message;
};
