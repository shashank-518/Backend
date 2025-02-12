// likes [icon: thumbs-up] {
//     id string pk
//     video ObjectId videos
//     comment ObjectId comments
//     tweet ObjectId tweets
//     likedBy ObjectId users
//     createdAt Date
//     updatedAt Date
//   }


import mongoose,{Schema} from "mongoose";

const LikesSchema = Schema({

})

export const Likes = mongoose.model("Likes",LikesSchema)