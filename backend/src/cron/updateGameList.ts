import getGameInfo from "../components/psstore/gameInfo";
import GameModel from "../models/games";
import Bot from "../bot";
import { IGame } from "../models/games";
import { IGameInfo } from "../components/psstore/gameInfo";

const updateGameList = async (ids: number[] = []): Promise<void> => {
  console.time("update time");

  let fullGameList: IGame[] = [];
  let todayMidnight: Date = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const todayMidnightTimestamp: number = todayMidnight.getTime();

  let filter = {};

  if (ids.length > 0) {
    filter = {
      id: {
        $in: ids,
      },
    };
  } else {
    filter = {
      $or: [
        {
          modified: { $lt: todayMidnightTimestamp },
        },
        {
          modified: { $exists: false },
        },
      ],
    };
  }

  fullGameList = await GameModel.find(filter);

  const gameList: IGame[] = await GameModel.find(filter)
    .sort({ "plus.from": -1 })
    .limit(30);

  let counter: number = 0;
  for await (const game of gameList) {
    const gameInfo: IGameInfo | null = await getGameInfo(game);

    const resUpdate = await updateGame(game, gameInfo);

    const res = await GameModel.findOneAndUpdate({ id: game.id }, resUpdate, {
      new: true,
    });
    
    console.log(`${counter}/${gameList.length}`, game.namenew Date(res.modified));

    counter++;
  }

  // if (
  //   fullGameList.length === gameList.length &&
  //   fullGameList.length !== 0
  // ) {
  //   await Bot.telegram.sendMessage(
  //     process.env.TELEGRAM_DEFAULT_ADMIN,
  //     `All done\\!`,
  //     {
  //       parse_mode: "MarkdownV2",
  //       disable_web_page_preview: true,
  //     }
  //   );
  // }

  console.timeEnd("update time");
};
export default updateGameList;

export const updateGame = async (
  game: IGame,
  gameInfo: IGameInfo | null
): Promise<any> => {
  const update = { $set: { modified: Date.now() } };

  if (gameInfo) {
    update["$set"]["data"] = gameInfo.data;

    if (gameInfo?.plus.tier) {
      if (!game.plus) {
        update["$set"]["plus"] = {
          ...gameInfo.plus,
          from: Date.now(),
        };
      } else {
        if (!game.plus?.from) {
          update["$set"]["plus"] = {
            ...gameInfo.plus,
            from: Date.now(),
          };
        } else {
          if (game.plus.to && game.plus.to < Date.now()) {
            update["$set"]["plus"] = {
              ...gameInfo.plus,
              from: Date.now(),
            };
          } else {
            update["$set"]["plus"] = {
              ...gameInfo.plus,
              from: game.plus.from,
            };
          }
        }
      }
    } else if (game.plus?.from) {
      update["$set"]["plus"] = { ...game.plus, to: Date.now() };
    }
  }

  return update;
};
