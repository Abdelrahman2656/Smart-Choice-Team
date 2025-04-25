import { Router } from "express";
import * as wishlistService from './wishlist.service'
import *as wishlistValidation from './wishlist.validation'
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
import { isValid } from "../../Middleware/validation";
import { asyncHandler } from "../../Middleware/asyncHandler";



const wishlistRouter =Router()

//add wishlist
wishlistRouter.post('/wishlist',isAuthentication,isAuthorization([roles.USER]),isValid(wishlistValidation.addWishlist),
asyncHandler(wishlistService.addWishList))
//get wishlist
wishlistRouter.get('/all-wishlist',isAuthentication,isAuthorization([roles.USER]),asyncHandler(wishlistService.getWishlist))
//delete wishlist
wishlistRouter.delete('/delete-wishlist',isAuthentication,isAuthorization([roles.USER]),asyncHandler(wishlistService.deleteWishList))
export default wishlistRouter