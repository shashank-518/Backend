import mongoose from "mongoose";

import { ApiError } from "../utils/ApiError";

const errorHandler = (err,req,res,next)=>{

    let error = err

    if(!(error instanceof ApiError)){
        const statusCode = error.statusCode || error instanceof mongoose.error ? 500 : 400

        const message = error.message || "Something Went Worng"

        error = new ApiError(statusCode ,message,error?.errors || [], err.stack)

    }

}

export {errorHandler}