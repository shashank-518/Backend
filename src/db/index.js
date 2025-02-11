import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.
            MONGODB_URI}/${DB_NAME}`)

        console.log(`Connection established Host Name ${connectionInstance.connection.host}`);

        return connectionInstance;
        


    } catch (error) {
        console.log("There is an error in database connection" , error);
        throw error
    }
}

export default connectDB;


