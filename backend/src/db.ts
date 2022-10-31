import mongoose from "mongoose";

const connectDB = () => {
  console.log("Try connect to mongo");
  mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@164.92.146.117:27018/server`,
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
