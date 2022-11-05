import { Composer } from "telegraf";
import Users from "../../models/users";

export default {
  help: "/start",
  run: Composer.command("/start", async (ctx) => {
    try {
      const res = await Users.findOneAndUpdate(
        { id: ctx.update.message.from.id },
        {
          id: ctx.update.message.from.id,
          status:
            ctx.update.message.from.id ===
            parseInt(process.env.TELEGRAM_DEFAULT_ADMIN, 10)
              ? "admin"
              : "user",
        },
        { upsert: true, new: true }
      );
      ctx.reply(
        "✋ Hi! Now you can enable report about new and expiring games in PS Plus. Just send /report for enable and one more time for disable. \nSend /help for more information."
      );
    } catch (e) {
      console.log(e);
      ctx.reply(e._message);
    }
  }),
};
