import { Schema } from "mongoose";

const teamSchema = new Schema({
  designation: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
});

export { teamSchema };
