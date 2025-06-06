import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Users } from "../models/users.models.js";
import {
  deletefromClouldinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Mongoose } from "mongoose";

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await Users.findById(userId);

    if (!user) {
      console.log("There is no user by this User Id");
      throw new ApiError(500, "Register a user with this name");
    }

    const RefreshToken = user.generateRefreshToken();
    const AccessToken = user.generateAccessToken();

    user.refreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false });
    return { RefreshToken, AccessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "There was an error trying to generate new access and refresh token"
    );
  }
};

const RegisterUser = asyncHandler(async (req, res) => {
  const { fullName, username, password, email } = req.body;

  if (
    [fullName, username, password, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(404, "There Was some Error");
  }

  const existedUser = await Users.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User Already Exists");
  }

  const avatarlocalpath = req.files?.avatar?.[0]?.path;
  const coverlocalpath = req.files?.coverImage?.[0]?.path;

  // if(!avatarlocalpath){
  //     throw new ApiError(400 , "Avatar file is missing")
  // }

  // const avatarImage = uploadOnCloudinary(avatarlocalpath)

  // let coverImage = ""
  // if(coverlocalpath){
  //     coverImage = uploadOnCloudinary(coverlocalpath)
  // }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarlocalpath);
    console.log("Avatar uploaded successfully:", avatar);
  } catch (error) {
    console.log("Error has been Occurred", error);
    throw new ApiError(500, "Failed to load avatar");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverlocalpath);
    console.log("cover Image uploaded successfully:", coverImage);
  } catch (error) {
    console.log("Error has been Occurred", error);
    throw new ApiError(500, "Failed to load Cover Image");
  }

  try {
    const user = await Users.create({
      fullName,
      username,
      password,
      email,
      avatar: avatar.url || "",
      coverImage: coverImage.url || "",
    });

    const createdUser = await Users.findById(user._id).select({
      password: 0,
      refreshToken: 0,
    });

    if (!createdUser) {
      throw new ApiError(500, "There is some Error from Your Side");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User Created Successfully"));
  } catch (error) {
    console.log("Something went wrong while registering an user");

    if (avatar) {
      await deletefromClouldinary(avatar.public_id);
    }
    if (coverImage) {
      await deletefromClouldinary(coverImage.public_id);
    }

    throw new ApiError(
      500,
      "There is some Error from Your Side and images were deleted"
    );
  }
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email) {
    throw new ApiError(500, "Email is required");
  }

  const User = await Users.findOne({ $or: [{ username }, { email }] });

  if (!User) {
    throw new ApiError(500, "No User Found");
  }

  const isPasswordValid = await User.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(500, "Invalid credentials");
  }

  const { refreshToken, AccessToken } = generateRefreshAndAccessToken(User._id);

  const loggedInUser = await User.findById(User._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "There is some problem Trying to log you in");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("AccessToken", AccessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, AccessToken },
        "User Logged In Successfully"
      )
    );
});


const LogoutUser = asyncHandler(async(req , res)=>{
  await Users.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken : undefined ,
      }
    },
    {new:true}
  )

  const options = {
    httpOnly : true,
    secure : process.env.NODE_ENV === 'production'
  }

  return res
  .status(200)
  .clearCookie('accessToken' , options)
  .clearCookie('refreshToken' , options)
  .json(new ApiResponse(200 , {} , "User Logged Out Successfully"))

})

const refreshToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken ;

    if(!incomingRefreshToken){
      throw new ApiError(404, "Refresh Token is Required");
    }

    try{
        const decoded = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
        const user = await Users.findById(decoded?._id);

        if(!user){
          throw new ApiError(401 , "Invalid refresh Token")
        }

      if(incomingRefreshToken !== Users?.refreshToken){
        throw new ApiError(401 , "Invalid Refresh Token")
      }


      const {RefreshToken: newRefreshToken,AccessToken} = await generateRefreshAndAccessToken(user._id)

      const options = {
          httpOnly : true,
          secure : process.env.NODE_ENV === 'production'
      }

      return res
      .status(200)
      .cookie("accessToken" , AccessToken, options)
      .cookie("refreshToken" , newRefreshToken,options)
      .json(
        new ApiResponse(
          200 ,
          {
            AccessToken,
            refreshToken: newRefreshToken,
          },
          "Access Token restored Successfully"
        )
      )




    }catch(error){
        throw new ApiError(500 , "Something went wrong while handling the api refresh token")
    }

})


const changeCurrentPassword = asyncHandler (async(req,res)=>{

  const {oldPassword, newPassword} = req.body;

  const user = await Users.findById(req.user?._id)

  const isPasswordCorrect = user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(404 , "Old Password is Incorrect" )
  }

  user.password = newPassword;

  user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200 , {} , "Password Changed Successfully"))
})

const getCurrentUser = asyncHandler (async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200 , req.user , "Current User Deatils"))
})

const updateUserDetails = asyncHandler (async(req,res)=>{

  const {fullname , email} = req.body;

  const user = await Users.findByIdAndUpdate(req.user?._id , {
    $set:{
      fullname,
      email
    }
  },
  {new:true}

  ).select("-password refreshToken")


  return res
  .status(200)
  .json(new ApiResponse(200 , user , "User Details Updated"))

})

const updateUserAvatar = asyncHandler (async(req,res)=>{

  const avatarLocalPath = req.file.path;

  if(!avatarLocalPath){
    throw new ApiError(404 , "File Path is required")
  }

  const avatarcloud = await uploadOnCloudinary(avatarLocalPath)

  if(!avatarcloud.url){
   throw  new ApiError(404 , "There was a error in uploading")
  }

  const user = await Users.findByIdAndUpdate(req.user?.id , {
    $set:{
      avatar : avatarcloud.url
    }
  }, {new : true}).select("-password refreshToken")

  return res
  .status(200)
  .json(new ApiResponse(200 , user , "ChangedAvatarCloud"))
  
})

const updateUserCoverImage = asyncHandler (async(req,res)=>{

  const coverImage = req.file?.path

  if(!coverImage){
    throw new ApiError(404 , "Cover Image is required")
  }

  const cloudcover = await uploadOnCloudinary(coverImage)

  if(cloudcover.url){
    throw new ApiError(404 , "Error Ocuured") 
  }

  const user = await Users.findByIdAndUpdate(req.user?._id , {
    $set:{
      coverImage : cloudcover.url
    }
  },
  {new:true}
).select("-password refreshToken")

  return res
  .status(200)
  .json(new ApiResponse(200 , user , "changed in Updating User Cover Image"))
  
})


const getUserChannelProfile = asyncHandler(async(req,res)=>{

  const {username} = req.params;

  if(username?.trim()){
    throw new ApiError(404 , "No user found")
  }

  const channel = await Users.aggregate(
    [
      {
        $match:{
          username : username?.toLowerCase()
        }
      },
      {
        $lookup:{
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as:"subscribers"
        }
      },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"subscriber",
          as: "subscribedTo"
        }
      },
      {
        $addFields:{
          subscribersCount:{
            $size:"$subscribers"
          },
          channelSubscribedTo:{
            $size:"$subscribedTo"
          },
          isSubscribed:{
            $cond:{
              if: {$in: [req.user?._id , "$subscribers.subscriber" ]},
              then:true,
              else:false
            }
          }

        }
        
      },
      {
        $project:{
          fullname : 1,
          username : 1,
          avatar:1,
          coverImage:1,
          subscribersCount:1,
          channelSubscribedTo:1,
          isSubscribed:1
        }
      }
    ]
  )

  if(!channel?.length){
      throw new ApiError(404 , "There is something wrong in aggregation")
  }


  return res.status(200)
  .json(new ApiResponse(200 , channel[0], "Successfully data has been sent"))




})

const getUserWatchHistory = asyncHandler(async(req,res)=>{
  const user = await Users.aggregate([
      {
        $match:{
          _id: new Mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $lookup:{
          from:"videos",
          localField:"watchHistory",
          foreignField:"_id",
          as:"userWatchHistory",
          pipeline:[
            {
              $lookup:{
                from:"Users",
                localField:"owner",
                foreignField:"_id",
                as:"Owner",
                pipeline:[
                  {
                    $project:{
                      fullname:1,
                      userName:1,
                      avatar:1
                    }
                  }
                ]
              }
            },
            {
              $addFields:{
                owner:{
                  $first:"$owner"
                }
              }
            }
          ]
        }
      }
  ])


  if(!user.length){
    throw new ApiError(404, "User watch history not found")
  }

  return res
  .status(200)
  .json(new ApiResponse(200 , user , "Successfully"))

})



export { RegisterUser , LoginUser , refreshToken , LogoutUser};
