import { Router } from "express";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { isValid } from "../../Middleware/validation";
import * as userService from './user.service';
import * as userValidation from './user.validation';
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
const userRouter = Router()
// sign up
userRouter.post('/signup',isValid(userValidation.signUpVal),asyncHandler( userService.signUp))
// confirm email 
userRouter.patch('/confirm-email',isValid(userValidation.confirmEmailVal),asyncHandler( userService.ConfirmEmail))
//activate-account
userRouter.get('/activate-account/:token',asyncHandler( userService.activateAccount))
//refresh-Token
userRouter.post('/refresh-token',isValid(userValidation.refreshTokenVal),asyncHandler( userService.refreshToken))
//login
userRouter.post('/signin',isValid(userValidation.signInVal),asyncHandler( userService.login))
//login with google
userRouter.post('/google-login',isValid(userValidation.loginWithGoogleVal),asyncHandler( userService.loginWithGoogle))
//forget password
userRouter.post('/forget-password',isValid(userValidation.forgetPasswordVal),asyncHandler( userService.forgetPassword))
//change password 
userRouter.put('/change-password',isValid(userValidation.changePasswordVal),asyncHandler( userService.changePassword))
//share profile
userRouter.get("/profile/:userId",isAuthentication,isAuthorization([roles.USER]),isValid(userValidation.shareProfile),asyncHandler(userService.shareProfile))
//update Profile
userRouter.put("/update-profile/:userId",isAuthentication,isAuthorization([roles.USER]),isValid(userValidation.updateUser),asyncHandler(userService.updateProfile))
export default userRouter