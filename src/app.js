import express from "express"
import cors from "cors"
import healthCheckRouter from "./routes/heathcheckup.routes.js"
import userRoute  from "./routes/RegisterUser.routes.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

// common middlewares
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser())


app.use("/api/v1/healthcheckRouter", healthCheckRouter)
app.use("/api/v1/users", userRoute)


export {app}