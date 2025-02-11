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


import mongoose,{Schema} from "mongoose";

const videoSchema = new Schema({

})

export const Videos = mongoose.model("Videos",videoSchema)

