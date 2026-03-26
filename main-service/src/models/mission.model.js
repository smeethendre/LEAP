import mongoose, { Schema } from 'mongoose'

const missionSchema = new Schema(
  {
    missionId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,   // e.g. "HAB-01", "CANSAT-01"
    },
    missionName: {
      type:     String,
      required: true,
      trim:     true,
    },
    missionType: {
      type:     String,
      enum:     ['HAB', 'CANSAT', 'CUBESAT'],
      required: true,
    },
    description: {
      type:    String,
      default: null,
    },
    status: {
      type:    String,
      enum:    ['upcoming', 'active', 'completed', 'failed'],
      default: 'upcoming',
    },
    launchDate: {
      type:    Date,
      default: null,
    },
    landingDate: {
      type:    Date,
      default: null,
    },
    maxAltitude: {
      type:    Number,   // metres
      default: null,
    },
    location: {
      type:    String,   // launch site
      default: null,
    },
    teamMembers: [
      {
        type: Schema.Types.ObjectId,
        ref:  'Team',
      }
    ],
    coverImage: {
      type:    String,   // URL
      default: null,
    },
    isPublished: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const Mission = mongoose.model('Mission', missionSchema)