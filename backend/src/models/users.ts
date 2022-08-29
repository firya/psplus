import { model, Schema } from "mongoose";

export interface IUser {
  id: number;
  status: "admin" | "user";
  created: number;
  report: {
    on: boolean;
  };
}

const UserSchema = new Schema<IUser>({
  id: { type: Number, required: true },
  status: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  created: { type: Number, default: () => Date.now() },
  report: {
    on: { type: Boolean, default: false },
  },
});

export default model<IUser>("UserModel", UserSchema);
