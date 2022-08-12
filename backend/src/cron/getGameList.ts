import GameModel from "../models/games";
import getAllGames from "../components/psstore/gameList";

const getGameList = async () => {
  const result = await getAllGames();
  GameModel.bulkWrite(
    result.map((item) => ({
      updateOne: {
        filter: { id: item.id },
        update: {
          $set: {
            id: item.id,
            name: item.name,
            modified: Date.now(),
          },
        },
        upsert: true,
      },
    }))
  );
};

export default getGameList;
