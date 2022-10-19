import { Composer } from "telegraf";
import { prepareReport } from "../../cron/dailyReport";
import sendLongMessage from "../middlewares/sendLongMessage";

export default {
  help: "/reportnow — Send today's report now",
  run: Composer.command("/reportnow", async (ctx) => {
    let message: string = await prepareReport();

    sendLongMessage(ctx.update.message.from.id, message);
  }),
};
