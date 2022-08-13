import getAllGames from "../components/psstore/gameList";
import getGameInfo from "../components/psstore/gameInfo";
import GameModel from "../models/games";

const updateGameList = async () => {
  console.time("update start");
  var todayMidnight = new Date();
  todayMidnight.setHours(1, 0, 0, 0);
  const gameList = await GameModel.find({
    modified: { $lt: todayMidnight.getTime() },
  }).limit(100);

  let counter = 0;
  for await (const game of gameList) {
    const gameInfo = await getGameInfo(game.id);
    console.log(`${counter}/${gameList.length}`, game.name, gameInfo);

    const update = { $set: { modified: Date.now() } };

    if (gameInfo) {
      if (!game.plus?.to || game.plus.to < gameInfo.to) {
        update["$set"]["plus"] = { ...gameInfo, from: Date.now() };
      }
    }

    const res = await GameModel.findOneAndUpdate({ id: game.id }, update);

    counter++;
  }

  console.log("all done");
  console.timeEnd("update start");
};
export default updateGameList;
