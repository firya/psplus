import express from "express";
import Bot, { secretPath } from "./bot";
import bodyParser from "body-parser";

import connectDB from "./db";
import router from "./router";
import "./cron";

connectDB();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router(app);
app.use(Bot.webhookCallback(secretPath));

app.use(express.static("public", { extensions: ["html"] }));

app.listen(3001, () => {
  console.log(`Example app listening on port 3001!`);
});
