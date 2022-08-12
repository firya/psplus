import getGameList from "../../cron/getGameList";

import { Composer } from "telegraf";

export default {
  help: "/loadgamelist — Force load of game list",
  run: Composer.command("/loadgamelist", async (ctx) => {
    try {
      await getGameList();

      ctx.reply("👍");
    } catch (e) {
      ctx.reply(e._message);
    }
  }),
};
