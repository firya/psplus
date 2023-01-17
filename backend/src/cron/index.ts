import Cron from "cron";
import updateGameList from "./updateGameList";
import getGameList from "./getGameList";
import { sendReport } from "./dailyReport";

new Cron.CronJob(
  "0 0 * * *",
  async () => {
    if (process.env.NODE_ENV === "production") {
      await getGameList();
    }
  },
  null,
  true,
  "Europe/Moscow"
);

new Cron.CronJob(
  "*/1 * * * *",
  async () => {
    if (process.env.NODE_ENV === "production") {
      await updateGameList();
    }
  },
  null,
  true,
  "Europe/Moscow"
);

new Cron.CronJob(
  "0 10 * * *",
  async () => {
    await sendReport();
  },
  null,
  true,
  "Europe/Moscow"
);
