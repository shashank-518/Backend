import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { Users } from "../models/users.models.js"
import asyncHandler from "../utils/asyncHandler.js"


export const  authmiddleware = asyncHandler( async (req,res,next)=>{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer " , "")

    if(!token){
        throw new ApiError(401 , "UnAuthorized")
    }


    try {
        const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        const user = await Users.findById(decoded._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401 , "No user found");
        }


        req.user = user;

        next()
        
    } catch (error) {

        throw new ApiError(401 , error?.message || "Access Denied")
        
    }

})