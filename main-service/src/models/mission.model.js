import mongoose, { Schema } from "mongoose";

const missionSchema = new Schema(
  {
    missionId: {
      type: String,
      required: true,
      unique: true,
    },
    missionName: { type: String, required: true },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "failed"],
      default: "upcoming",
    },
    launchDate: { type: Date, default: null },
    location: { type: String, default: null },
    coverImage: { type: String, default: null },
  },
  { timestamps: true },
);

export const Mission = mongoose.model("Mission", missionSchema);
