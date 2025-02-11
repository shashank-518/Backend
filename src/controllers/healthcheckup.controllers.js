import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const healthCheckUp = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200 , "Ok" , "Health check passed"))
})

export {healthCheckUp}