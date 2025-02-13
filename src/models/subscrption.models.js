// subscriptions [icon: money] {
//     id string pk
//     subscriber ObjectId users
//     channel ObjectId users
//     createdAt Date
//     updatedAt Date
//   }


import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({

    subscriber:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },
    channel:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    }

},{
    timestamps:true
}

)

export const Subscibe = mongoose.model('Subscribe' , subscriptionSchema)