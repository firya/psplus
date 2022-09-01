import getGameInfo from "../components/psstore/gameInfo";
import GameModel from "../models/games";
import Bot from "../bot";
import { IGame } from "../models/games";
import { IGameInfo } from "../components/psstore/gameInfo";

const updateGameList = async (force: boolean = false): Promise<void> => {
  console.time("update time");

  let filter = {};
  let fullGameList: IGame[] = [];
  if (force) {
    var todayMidnight: Date = new Date();
    todayMidnight.setHours(1, 0, 0, 0);

    filter = {
      modified: { $lt: todayMidnight.getTime() },
    };

    fullGameList = await GameModel.find(filter);
  }
  const gameList: IGame[] = await GameModel.find(filter)
    .sort({ "plus.from": -1 })
    .limit(100);

  let counter: number = 0;
  for await (const game of gameList) {
    const gameInfo: IGameInfo | null = await getGameInfo(game);
    console.log(`${counter}/${gameList.length}`, game.name, gameInfo);

    const resUpdate = await updateGame(game, gameInfo);
    await GameModel.findOneAndUpdate({ id: game.id }, resUpdate);

    counter++;
  }

  if (
    force &&
    fullGameList.length === gameList.length &&
    fullGameList.length !== 0
  ) {
    await Bot.telegram.sendMessage(
      process.env.TELEGRAM_DEFAULT_ADMIN,
      `All done\\!`,
      {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }
    );
  }

  console.timeEnd("update time");
};
export default updateGameList;

export const updateGame = async (
  game: IGame,
  gameInfo: IGameInfo | null
): Promise<any> => {
  const update = { $set: { modified: Date.now() } };

  update["$set"]["data"] = gameInfo.data;

  if (gameInfo?.plus.tier) {
    if (!game.plus || (game.plus?.to < Date.now() && game.plus.updated)) {
      update["$set"]["plus"] = {
        ...gameInfo,
        updated: false,
        from: Date.now(),
      };
    } else if (
      (!game.plus?.to || game.plus.to < gameInfo.plus.to) &&
      !game.plus.updated
    ) {
      update["$set"]["plus"] = {
        ...gameInfo,
        from: game.plus.from,
        updated: false,
      };
    }
  } else if (game.plus?.from) {
    update["$set"]["plus"] = { ...game.plus, to: Date.now() };
  }

  return update;
};
