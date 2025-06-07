import { Router } from "express";

import { RegisterUser , LogoutUser, LoginUser, changeCurrentPassword, getCurrentUser, updateUserDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getUserWatchHistory ,  } from "../controllers/RegisterUser.controllers.js";
import { uploads } from "../middleware/multer.middleware.js";

import { authmiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(uploads.fields([
    { name: "avatar", maxCount: 1 }, 
    {name:"coverImage", maxCount:1}
]), 
    RegisterUser);

router.route("/login").post(LoginUser)

router.route('/logout').post(authmiddleware , LogoutUser);
router.route('/changePassword').post(authmiddleware , changeCurrentPassword)
router.route('/getCurrentUser').post(authmiddleware , getCurrentUser)
router.route('/updateUser').post(authmiddleware , updateUserDetails)
router.route('/updateAvatar').post(authmiddleware , updateUserAvatar)
router.route('/updateCoverImage').post(authmiddleware , updateUserCoverImage)
router.route('/userprofile').post(authmiddleware,getUserChannelProfile)
router.route('/watchhistory').post(authmiddleware,getUserWatchHistory)


export default router;
