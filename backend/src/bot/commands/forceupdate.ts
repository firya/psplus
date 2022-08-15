import { Composer } from "telegraf";
import GameModel from "../../models/games";

export default {
  help: "/forceupdate — Force update of PS Plus list",
  run: Composer.command("/forceupdate", async (ctx) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await GameModel.updateMany(
        {},
        { $set: { modified: yesterday.getTime() } }
      );
      ctx.reply("👍");
    } catch (e) {
      ctx.reply(e._message);
    }
  }),
};
