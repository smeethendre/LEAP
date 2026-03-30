import { Schema } from "mongoose";

const telemetrySchema = new Schema({});

export const Telemetry = mongoose.model("telemetry", telemetrySchema);
