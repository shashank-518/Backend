import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"


dotenv.config()
// config cloudinary setting

cloudinary.config({ 
    cloud_name: process.env.CLOUDNAIRY_CLOUD_NAME, 
    api_key: process.env.CLOUDNAIRY_API_KEY, 
    api_secret: process.env.CLOUDNAIRY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {

        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type:"auto"})

        console.log(response.url);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}


const deletefromClouldinary = async(publicId) =>{
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("Deleted successfully from couldinary", publicId);
        
    } catch (error) {
        console.log("There was an error deleting file from couldinary",error);
        return null
    }
}

export {uploadOnCloudinary , deletefromClouldinary}