import { Composer } from "telegraf";
import Users from "../../models/users";

export default {
  help: "/userlist — Show list of users",
  run: Composer.command("/userlist", async (ctx) => {
    const userList = await Users.find({});

    ctx.reply(
      `Всего пользователей: ${userList.length}\n` +
        userList.map((user) => `${user.id} — ${user.status}`).join("\n")
    );
  }),
};
