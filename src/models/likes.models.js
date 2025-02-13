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

const LikesSchema = new Schema({
    video:{
        type:mongoose.Types.ObjectId,
        ref:"Videos"
    },
    comment:{
        type:mongoose.Types.ObjectId,
        ref:"Comments"
    },
    tweet:{
        type:mongoose.Types.ObjectId,
        ref:"Tweets"
    },
    likedBy:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },



},
{timestamps:true}
)

export const Likes = mongoose.model("Likes",LikesSchema)