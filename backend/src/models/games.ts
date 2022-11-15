import { model, Schema } from "mongoose";

export type IPlusInfo = {
  from?: number;
  to?: number;
  acessType: string;
  tier: string;
  updated?: boolean;
};

export type IPlusInfoData =
  | IPlusInfo
  | {
      error: string;
    };

export interface IGameData {
  description: string;
  metacritic: number;
  background_image: string;
  platforms: string[];
  esrb_rating: string;
  modified: number;
  released: number;
}

export interface IGame {
  id: number;
  name: string;
  modified: number;
  created: number;
  plus?: IPlusInfo;
  data?: IGameData;
}

const GameSchema = new Schema<IGame>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  modified: { type: Number },
  created: { type: Number, default: () => Date.now() },
  plus: {
    tier: { type: String }, // Premium / Extra
    from: { type: Number },
    to: { type: Number },
    acessType: { type: String }, // access / stream / trial
    updated: { type: Boolean, default: false },
  },
  data: {
    description: { type: String },
    metacritic: { type: Number },
    released: { type: Number },
    background_image: { type: String },
    genres: [{ type: String }],
    platforms: [{ type: String }],
    esrb_rating: { type: String },
    modified: { type: Number },
  },
});

export default model<IGame>("GameModel", GameSchema);
