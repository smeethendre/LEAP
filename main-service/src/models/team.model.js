import mongoose, { Schema } from 'mongoose'

const teamSchema = new Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    designation: {
      type:     String,
      required: true,
      trim:     true,
    },
    bio: {
      type:    String,
      default: null,
    },
    photo: {
      type:    String,   
      default: null,
    },
    github: {
      type:    String,
      default: null,
    },
    linkedin: {
      type:    String,
      default: null,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export const Team = mongoose.model('Team', teamSchema)