// videos [icon: video] {
//     id string pk
//     owner ObjectId users
//     videoFile string
//     thumbnail string
//     title string
//     description string
//     duration number
//     views number
//     isPublished boolean
//     createdAt Date
//     updatedAt Date
//   }

import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

export const Videos = mongoose.model("Videos", videoSchema);
