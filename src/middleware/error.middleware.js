import mongoose from "mongoose";

import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err,req,res,next)=>{

    let error = err

    if(!(error instanceof ApiError)){
        const statusCode = error.statusCode || error instanceof mongoose.error ? 500 : 400

        const message = error.message || "Something Went Worng"

        error = new ApiError(statusCode ,message,error?.error || [], err.stack)

    }


    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development"?{stack: error.stack} : {})
    }

    return res.status(error.statusCode).json(response)

}

export {errorHandler}