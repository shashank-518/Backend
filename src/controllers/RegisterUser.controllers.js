import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { Users } from "../models/users.models";

const RegisterUser = asyncHandler(async(req,res)=>{
    const {fullname,username,password,email} = req.body;

    if([fullname,username,password,email].some((field) => field?.trim() === "" )){
        throw new ApiError(404 , "There Was some Error")
    }

    const existedUser = await Users.findOne({$or:[{username},{email}]})

    if(existedUser){
        throw new ApiError(409, "User Already Exists")
    }

    




})

export {
    RegisterUser
}