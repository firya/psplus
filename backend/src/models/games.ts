import { model, Schema } from "mongoose";

export interface IGame {
  id: number;
  name: string;
  modified: number;
  created: number;
  plus?: {
    from: number;
    to: number;
    acessType: string;
    tier: string;
    updated: boolean;
  };
}

const GameSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  modified: { type: Number },
  created: { type: Number, default: () => Date.now() },
  plus: {
    tier: { type: String },
    from: { type: Number },
    to: { type: Number },
    acessType: { type: String }, // access / stream / trial
    updated: { type: Boolean, default: false },
  },
});

export default model<IGame>("GameModel", GameSchema);
