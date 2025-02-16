import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { Users } from "../models/users.models";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

const RegisterUser = asyncHandler(async(req,res)=>{
    const {fullname,username,password,email} = req.body;

    if([fullname,username,password,email].some((field) => field?.trim() === "" )){
        throw new ApiError(404 , "There Was some Error")
    }

    const existedUser = await Users.findOne({$or:[{username},{email}]})

    if(existedUser){
        throw new ApiError(409, "User Already Exists")
    }

    const avatarlocalpath = req.files?.avatar[0]?.path
    const coverlocalpath = req.files?.coverImage[0]?.path

    if(!avatarlocalpath){
        throw new ApiError(400 , "Avatar file is missing")
    }

    const avatarImage = uploadOnCloudinary(avatarlocalpath)

    let coverImage = ""
    if(coverlocalpath){
        coverImage = uploadOnCloudinary(coverlocalpath) 
    }

    const user = await Users.create({
        fullname,
        username,
        password,
        avatar:avatarImage.url,
        coverImage:coverImage?.url || ""
    })

    const createdUser = await Users.findById(user._id).select("-password","-refreshToken")

    if(!createdUser){
        throw new ApiError(500 , "There is some Error from Your Side")
    }

    return res.status(200).json(new ApiResponse(200 , createdUser , "User Created Successfully"))




})

export {
    RegisterUser
}