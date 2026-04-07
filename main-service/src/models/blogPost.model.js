import mongoose, { Schema } from 'mongoose'

const blogPostSchema = new Schema(
  {
    blogTitle: {
      type:     String,
      required: true,
      trim:     true,
    },
    blogDescription: {
      type:     String,
      required: true,
    },
    blogContent: {
      type:     String,
      required: true,
    },
    coverImage: {
      type:    String,    // URL string
      default: null,
    },
    tags: [{
      type: String,
    }],
    isPublished: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const BlogPost = mongoose.model('BlogPost', blogPostSchema)