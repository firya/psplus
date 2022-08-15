import express from "express";
import Bot, { secretPath } from "./bot";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import router from "./router";
import "./cron";

const connectDB = () => {
  console.log("Try connect to mongo");
  mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongo:27017/server`,
    (err) => {
      if (err) {
        console.log(err);
        setTimeout(connectDB, 5000);
      } else {
        console.log("Connected to mongo");
      }
    }
  );
};

connectDB();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router(app);
console.log(secretPath);
app.use(Bot.webhookCallback(secretPath));

app.use(express.static("public", { extensions: ["html"] }));

app.listen(3001, () => {
  console.log(`Example app listening on port 3001!`);
});
