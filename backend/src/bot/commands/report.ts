import { Composer } from "telegraf";
import Users from "../../models/users";

export default {
  help: "/report — enable/disable report about new and expiring games in PS Plus",
  run: Composer.command("/report", async (ctx) => {
    try {
      const userInfo = await Users.findOne({ id: ctx.update.message.from.id });

      const res = await Users.findOneAndUpdate(
        { id: ctx.update.message.from.id },
        {
          $set: { "report.on": !userInfo.report.on },
        }
      );

      ctx.reply(!res.report.on ? "📝 Report enabled" : "😶 Report disabled");
    } catch (e) {
      ctx.reply(e._message);
    }
  }),
};
