import { Composer } from "telegraf";
import Games from "../../models/games";

export default {
  help: "/update <id> <Premium | Extra> <access | stream | trial> [date] — Update game info",
  run: Composer.command("/update", async (ctx) => {
    const args = ctx.state.command.splitArgs;

    let setObj = {
      "plus.tier": args[1],
      "plus.acessType": args[2],
    };

    let unsetObj = {};

    if (args[3]) {
      setObj["plus.to"] = new Date(args[3]).getTime();
    } else {
      unsetObj["plus.to"] = "";
    }

    try {
      const res = await Games.findOneAndUpdate(
        { id: parseInt(args[0], 10) },
        {
          $set: setObj,
          $unset: unsetObj,
        },
        { upsert: true }
      );

      ctx.reply("👍");
    } catch (e) {
      ctx.reply(e.message);
    }
  }),
};
