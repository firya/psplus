import mongoose from "mongoose";

const connectDB = () => {
  console.log("Try connect to mongo");
  const dbServer =
    process.env.NODE_ENV === "production"
      ? "mongo:27017"
      : "164.92.146.117:27018";
  mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${dbServer}/server`,
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
