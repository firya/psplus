import Cron from "cron";
import GameModel from "../models/games";
import getAllGames from "../components/psstore/gameList";
import { updateGameList } from "./updateGameList";

import { sendReport } from "./dailyReport";

sendReport();

new Cron.CronJob(
  "0 0 * * *",
  async () => {
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
  },
  null,
  true,
  "Europe/Moscow"
);

new Cron.CronJob(
  "*/5 * * * *",
  async () => {
    await updateGameList();
  },
  null,
  true,
  "Europe/Moscow"
);

new Cron.CronJob(
  "25 14 * * *",
  async () => {
    await sendReport();
  },
  null,
  true,
  "Europe/Moscow"
);
