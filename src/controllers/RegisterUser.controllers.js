import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const RegisterUser = asyncHandler(async(req,res)=>{
    const {fullname,username,password,email} = req.body;

    if([fullname,username,password,email].some((field) => field?.trim() === "" )){
        throw new ApiError(404 , "There Was some Error")
    }




})

export {
    RegisterUser
}