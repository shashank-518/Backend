import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const mongooseConnection = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.
            MONGODB_URI}/${DB_NAME}`)

        console.log(`Connection established Host Name ${connectionInstance.connection.host}`);
        


    } catch (error) {
        console.log("There is an error in database connection" , error);
    }
}

export default mongooseConnection;


