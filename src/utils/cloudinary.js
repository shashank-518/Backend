import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
// config cloudinary setting

cloudinary.config({ 
    cloud_name: process.env.CLOUDNAIRY_CLOUD_NAME, 
    api_key: process.env.CLOUDNAIRY_API_KEY, 
    api_secret: process.env.CLOUDNAIRY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        
    } catch (error) {
        fs.unlink(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}