// comments [icon: comment] {
//     id string pk
//     video ObjectId videos
//     owner ObjectId users
//     content string
//     createdAt Date
//     updatedAt Date
//   }




import mongoose,{Schema} from "mongoose";

const CommentSchema = Schema({

})

export const Comments = mongoose.model("Comments",CommentSchema)