import express from "express"
import cors from "cors"
import healthCheckRouter from "./routes/heathcheckup.routes.js"
import userRoute  from "./routes/RegisterUser.routes.js"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middleware/error.middleware.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

// common middlewares that we will use
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())


app.use("/api/v1/healthcheckRouter", healthCheckRouter)
app.use("/api/v1/users", userRoute)

app.use(errorHandler)


export {app}