import { Composer } from "telegraf";
import updateGameList from "../cron/updateGameList";

export default Composer.on("callback_query", async (ctx) => {
  if (ctx.callbackQuery.data.indexOf("update") === 0) {
    if (
      ctx.callbackQuery.from.id ===
      parseInt(process.env.TELEGRAM_DEFAULT_ADMIN, 10)
    ) {
      const id = parseInt(ctx.callbackQuery.data.split(" ")[1]);

      const messageSent = await ctx.telegram.sendMessage(
        ctx.callbackQuery.from.id,
        "✋ Updating"
      );

      if (messageSent?.message_id) {
        updateGameList([id]);
        await ctx.telegram.editMessageText(
          ctx.callbackQuery.from.id,
          messageSent?.message_id,
          undefined,
          "✅ Done"
        );
      }
    } else {
      await ctx.telegram.sendMessage(
        ctx.callbackQuery.from.id,
        "You have no permission to use this command"
      );
    }
  }
});
