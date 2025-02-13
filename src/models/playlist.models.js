// playlists [icon: library] {
//     id string pk
//     owner ObjectId users
//     videos ObjectId[] videos
//     name string
//     description string
//     createdAt Date
//     updatedAt Date
//   }

import mongoose, { Schema } from "mongoose";

const PlayListSchema = new  Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    videos: {
      type: mongoose.Types.ObjectId,
      ref: "Videos",
    },
  },
  {
    timestamps: true,
  }
);

export const Playlist = mongoose.model("Playlist", PlayListSchema);
