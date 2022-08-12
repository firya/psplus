import { Composer } from "telegraf";
import {
  adduser,
  removeuser,
  userlist,
  myid,
  getall,
  getextra,
  getpremium,
  report,
  update,
  getexpiring,
} from "./index";
import { checkUserStatus } from "../middlewares/botPermissions";

export default Composer.command("/help", async (ctx) => {
  let message: string = "🆘 Command list: \n";
  if ((await checkUserStatus(ctx.update.message.from.id)) === "admin") {
    message += `${myid.help}\n${adduser.help}\n${removeuser.help}\n${userlist.help}\n${getall.help}\n${getextra.help}\n${getpremium.help}\n${report.help}\n${update.help}\n${getexpiring.help}`;
  } else {
    message += `${myid.help}\n${getall.help}\n${getextra.help}\n${getpremium.help}\n${report.help}\n${getexpiring.help}`;
  }

  ctx.reply(message);
});
