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

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function(next){
    // isModified is the method
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id:this._id,
        email:this.email
    }, process.env.ACCESS_TOKEN_KEY , {expiresIn: process.env.ACCESS_EXPIRES_IN} )
}

userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id:this._id,
    }, process.env.REFRESH_TOKEN_KEY , {expiresIn: process.env.REFRESH_EXPIRES_IN} )
}

export const Users = mongoose.model("Users", userSchema);
