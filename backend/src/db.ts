import mongoose from "mongoose";

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

export default connectDB;
