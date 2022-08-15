import getAllGames from "../components/psstore/gameList";
import getGameInfo from "../components/psstore/gameInfo";
import GameModel from "../models/games";
import Bot from "../bot";

const updateGameList = async () => {
  console.time("update time");
  var todayMidnight = new Date();
  todayMidnight.setHours(1, 0, 0, 0);
  const fullGameList = await GameModel.find({
    modified: { $lt: todayMidnight.getTime() },
  });
  const gameList = await GameModel.find({
    modified: { $lt: todayMidnight.getTime() },
  })
    .sort({ "plus.from": -1 })
    .limit(100);

  let counter = 0;
  for await (const game of gameList) {
    const gameInfo = await getGameInfo(game.id);
    console.log(`${counter}/${gameList.length}`, game.name, gameInfo);

    const update = { $set: { modified: Date.now() } };

    if (gameInfo) {
      if (gameInfo.tier) {
        if (!game.plus?.to || game.plus.to < gameInfo.to) {
          update["$set"]["plus"] = { ...gameInfo, from: Date.now() };
        }
      } else if (game.plus?.from) {
        update["$set"]["plus.to"] = Date.now();
      }
    }

    await GameModel.findOneAndUpdate({ id: game.id }, update);

    counter++;
  }

  if (fullGameList.length === gameList.length) {
    await Bot.telegram.sendMessage(
      process.env.TELEGRAM_DEFAULT_ADMIN,
      `All done!`,
      {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }
    );
  }

  console.timeEnd("update time");
};
export default updateGameList;
