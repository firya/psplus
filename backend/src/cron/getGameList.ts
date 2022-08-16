import GameModel from "../models/games";
import getAllGames, { IGameData } from "../components/psstore/gameList";

const getGameList = async () => {
  const result: IGameData[] = await getAllGames();
  GameModel.bulkWrite(
    result.map((item) => ({
      updateOne: {
        filter: { id: item.id },
        update: {
          $set: {
            id: item.id,
            name: item.name,
          },
        },
        upsert: true,
      },
    }))
  );
};

export default getGameList;
