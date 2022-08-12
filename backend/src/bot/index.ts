import { Telegraf } from "telegraf";
import { hostURL } from "../dev";
import {
  adduser,
  removeuser,
  userlist,
  myid,
  help,
  start,
  stop,
  report,
  getall,
  getpremium,
  getextra,
  update,
  getexpiring,
} from "./commands";

import commandParts from "./middlewares/commandParts";
import botPermissions from "./middlewares/botPermissions";

const token = process.env.TELEGRAM_TOKEN;
if (token === undefined) {
  throw new Error("TELEGRAM_TOKEN must be provided!");
}

const Bot = new Telegraf(token, { handlerTimeout: 9_000_000 });

Bot.use(commandParts());
Bot.use(botPermissions());

export const secretPath = `/telegraf/${Bot.secretPathComponent()}`;

try {
  Bot.telegram.setWebhook(`${hostURL}${secretPath}`);
  console.log(`bot successfully set up webhook at ${hostURL}${secretPath}`);
} catch (e) {
  console.log(e);
}

Bot.use(
  myid.run,
  adduser.run,
  removeuser.run,
  userlist.run,
  start.run,
  report.run,
  getall.run,
  getpremium.run,
  getextra.run,
  update.run,
  getexpiring.run,
  stop,
  help
);

export default Bot;
