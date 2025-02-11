// users [icon: user] {
//     id string pk
//     username string
//     email string
//     fullName string
//     avatar string
//     coverImage string
//     watchHistory ObjectId[] videos
//     password string
//     refreshToken string
//     createdAt Date
//     updatedAt Date
//   }

import mongoose ,{Schema} from "mongoose";

const userSchema = new Schema({

})

export const Users = mongoose.model("Users",userSchema)