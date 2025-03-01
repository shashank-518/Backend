import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Users } from "../models/users.models.js";
import { deletefromClouldinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateRefreshAndAccessToken = async(userId)=>{
    const user = await Users.findById(userId)

    if(!user){
        console.log("There is no user by this User Id");
        throw new ApiError(500 , "Register a user with this name");
    }

    const RefreshToken = user.generateRefreshToken()
    const AccessToken = user.generateAccessToken()

    user.refreshToken = RefreshToken

}

const RegisterUser = asyncHandler(async(req,res)=>{
    const {fullName,username,password,email} = req.body;

    if([fullName,username,password,email].some((field) => field?.trim() === "" )){
        throw new ApiError(404 , "There Was some Error")
    }

    const existedUser = await Users.findOne({$or:[{username},{email}]})

    if(existedUser){
        throw new ApiError(409, "User Already Exists")
    }

    const avatarlocalpath = req.files?.avatar?.[0]?.path
    const coverlocalpath = req.files?.coverImage?.[0]?.path

    // if(!avatarlocalpath){
    //     throw new ApiError(400 , "Avatar file is missing")
    // }

    // const avatarImage = uploadOnCloudinary(avatarlocalpath)

    // let coverImage = ""
    // if(coverlocalpath){
    //     coverImage = uploadOnCloudinary(coverlocalpath) 
    // }


    let avatar;
    try {
       avatar =  await uploadOnCloudinary(avatarlocalpath)
       console.log("Avatar uploaded successfully:", avatar);
    } catch (error) {
        console.log("Error has been Occurred" , error)
        throw new ApiError(500 , "Failed to load avatar")
    }

    let coverImage;
    try {
    coverImage =  await uploadOnCloudinary(coverlocalpath)
       console.log("cover Image uploaded successfully:", coverImage);
    } catch (error) {
        console.log("Error has been Occurred" , error)
        throw new ApiError(500 , "Failed to load Cover Image")
    }

    try {
        const user = await Users.create({
            fullName,
            username,
            password,
            email,
            avatar:avatar.url || "" ,
            coverImage:coverImage.url || ""
        })
    
        const createdUser = await Users.findById(user._id).select({ password: 0, refreshToken: 0 })
    
        if(!createdUser){
            throw new ApiError(500 , "There is some Error from Your Side")
        }
    
        return res.status(200).json(new ApiResponse(200 , createdUser , "User Created Successfully"))
    } catch (error) {
        console.log("Something went wrong while registering an user");

        if(avatar){
            await deletefromClouldinary(avatar.public_id)
        }
        if(coverImage){
            await deletefromClouldinary(coverImage.public_id)
        }

        throw new ApiError(500 , "There is some Error from Your Side and images were deleted")
        
    }




})



export {
    RegisterUser
}