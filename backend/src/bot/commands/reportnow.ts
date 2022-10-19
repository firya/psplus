import { Composer } from "telegraf";
import { prepareReport } from "../../cron/dailyReport";

export default {
  help: "/reportnow — Send today's report now",
  run: Composer.command("/reportnow", async (ctx) => {
    let message: string = await prepareReport();

    ctx.reply(message);
  }),
};
