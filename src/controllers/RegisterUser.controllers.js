import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Users } from "../models/users.models.js";
import {
  deletefromClouldinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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

export { RegisterUser , LoginUser , refreshToken , LogoutUser};
