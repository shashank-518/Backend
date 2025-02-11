import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const healthCheckUp = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200 , "Ok" , "Health check passed"))
})

export {healthCheckUp}