// tweets [icon: twitter] {
//     id string pk
//     owner ObjectId users
//     content string
//     createdAt Date
//     updatedAt Date  
//   }
  


import mongoose,{Schema} from "mongoose";

const TweetsSchema = Schema({

})

export const Tweets = mongoose.model("Tweets", TweetsSchema)