class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went Wrong",
        stack = "",
        error = []
    ){
        super()
        this.statusCode = statusCode
        this.message = message
        this.success = false
        this.data = null
        this.errors = error

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}

export {ApiError}