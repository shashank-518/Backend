// tweets [icon: twitter] {
//     id string pk
//     owner ObjectId users
//     content string
//     createdAt Date
//     updatedAt Date  
//   }
  


import mongoose,{Schema} from "mongoose";

const TweetsSchema = new Schema({

    owner:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },
    content:{
        type:String,
        required:true
    }


},{
    timestamps:true
})

export const Tweets = mongoose.model("Tweets", TweetsSchema)