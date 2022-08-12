import { Composer } from "telegraf";
import Users from "../../models/users";

export default Composer.on("my_chat_member", async (ctx) => {
  await Users.deleteOne({
    id: ctx.update.my_chat_member.chat.id,
  });
});
