// subscriptions [icon: money] {
//     id string pk
//     subscriber ObjectId users
//     channel ObjectId users
//     createdAt Date
//     updatedAt Date
//   }


import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({

})

export const Subscibe = mongoose.model('Subscribe' , subscriptionSchema)