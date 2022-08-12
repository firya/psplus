import { Composer } from "telegraf";
import Games from "../../models/games";

export default {
  help: "/update <id> <Premium | Extra> <access | stream | trial> <date> — Update game info",
  run: Composer.command("/update", async (ctx) => {
    const args = ctx.state.command.splitArgs;

    try {
      const res = await Games.findOneAndUpdate(
        { id: parseInt(args[0], 10) },
        {
          $set: {
            "plus.tier": args[1],
            "plus.acessType": args[2],
            "plus.to": new Date(args[3]).getTime(),
          },
        },
        { upsert: true }
      );

      ctx.reply("👍");
    } catch (e) {
      ctx.reply(e.message);
    }
  }),
};
