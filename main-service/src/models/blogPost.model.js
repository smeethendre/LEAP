import { Schema } from "mongoose";

const blogPostSchema = new Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },

    blogDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export { blogPostSchema };
