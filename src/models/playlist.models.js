// playlists [icon: library] {
//     id string pk
//     owner ObjectId users
//     videos ObjectId[] videos
//     name string
//     description string
//     createdAt Date
//     updatedAt Date
//   }


import mongoose,{Schema} from "mongoose";

const PlayListSchema = Schema({

})

export const Playlist = mongoose.model("Playlist",PlayListSchema)