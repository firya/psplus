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
  getexpiring,
  getnew,
  loadgamelist,
  forceupdate,
  reportnow,
} from "./index";
import { checkUserStatus } from "../middlewares/botPermissions";

export default Composer.command("/help", async (ctx) => {
  let message: string = "🆘 Command list: \n";
  if ((await checkUserStatus(ctx.update.message.from.id)) === "admin") {
    message += `${myid.help}\n${adduser.help}\n${removeuser.help}\n${userlist.help}\n${getall.help}\n${getextra.help}\n${getpremium.help}\n${report.help}\n${getexpiring.help}\n${getnew.help}\n${loadgamelist.help}\n${forceupdate.help}\n${reportnow.help}`;
  } else {
    message += `${myid.help}\n${getall.help}\n${getextra.help}\n${getpremium.help}\n${report.help}\n${getexpiring.help}\n${getnew.help}\n${reportnow.help}`;
  }

  ctx.reply(message);
});
