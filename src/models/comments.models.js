// comments [icon: comment] {
//     id string pk
//     video ObjectId videos
//     owner ObjectId users
//     content string
//     createdAt Date
//     updatedAt Date
//   }




import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentSchema = new  Schema(
    {

    content:{
        type:String,
        required:true
    },
    video:{
        type:mongoose.Types.ObjectId,
        ref:"Videos"
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },
},
{
  timest  
}

)

CommentSchema.plugin(mongooseAggregatePaginate)

export const Comments = mongoose.model("Comments",CommentSchema)