"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWishList = exports.getWishlist = exports.addWishList = void 0;
const Database_1 = require("../../../Database");
const AppError_1 = require("../../Utils/AppError/AppError");
const messages_1 = require("../../Utils/constant/messages");
//---------------------------------------------------add wishlist--------------------------------------------------------------
const addWishList = async (req, res, next) => {
    //get data from body
    const { productId, modelType } = req.body;
    const userId = req.authUser?._id;
    //check model
    if (!["Mobile", "Tv", "Laptop", "Tablet"].includes(modelType)) {
        return next(new AppError_1.AppError("Invalid Model", 500));
    }
    // Validate if product exists in its model collection
    const modelMap = {
        Mobile: Database_1.Mobile,
        Tv: Database_1.Tv,
        Laptop: Database_1.Laptop,
        Tablet: Database_1.Tablet,
    };
    const model = modelMap[modelType];
    if (!model) {
        return next(new AppError_1.AppError("Model not found", 500));
    }
    const productExists = await model.findById(productId);
    if (!productExists) {
        return next(new AppError_1.AppError("Product not found for this model", 404));
    }
    // Check if the product already exists in the user's wishlist
    const existingWishListItem = await Database_1.User.findOne({
        _id: userId,
        "wishList.productId": productId,
        "wishList.modelType": modelType,
    });
    if (existingWishListItem) {
        return next(new AppError_1.AppError("Product already in wishlist", 400));
    }
    //update
    const item = {
        productId,
        modelType,
    };
    const userUpdate = await Database_1.User.findByIdAndUpdate(userId, { $addToSet: { wishList: item } }, { new: true });
    console.log("Adding to wishlist:", item);
    //send response
    return res
        .status(201)
        .json({
        message: messages_1.messages.wishlist.updateSuccessfully,
        success: true,
        userUpdate,
    });
};
exports.addWishList = addWishList;
//---------------------------------------------------get wishlist --------------------------------------------------------------
const getWishlist = async (req, res, next) => {
    const userId = req.authUser?._id;
    const user = await Database_1.User.findById(userId, { wishList: 1 });
    if (!user)
        return next(new AppError_1.AppError("User not found", 404));
    // نلف على الـ wishlist
    const populatedWishlist = await Promise.all(user.wishList.map(async (item) => {
        let productData = null;
        switch (item.modelType) {
            case "Mobile":
                productData = await Database_1.Mobile.findById(item.productId);
                break;
            case "Tv":
                productData = await Database_1.Tv.findById(item.productId);
                break;
            case "Laptop":
                productData = await Database_1.Laptop.findById(item.productId);
                break;
            case "Tablet":
                productData = await Database_1.Tablet.findById(item.productId);
                break;
        }
        return {
            productId: item.productId,
            modelType: item.modelType,
            productData,
        };
    }));
    return res.status(200).json({ success: true, data: populatedWishlist });
};
exports.getWishlist = getWishlist;
//---------------------------------------------------delete wishlist --------------------------------------------------------------
const deleteWishList = async (req, res, next) => {
    //get data from req
    const { productId, modelType } = req.body;
    const userId = req.authUser?._id;
    // delete
    const item = {
        productId, modelType
    };
    const wishlistDeleted = await Database_1.User.findByIdAndUpdate(userId, { $pull: { wishList: item } }, { new: true }).select("wishList");
    //send response 
    return res.status(200).json({ message: "WishList Removed Successfully", success: true, data: wishlistDeleted });
};
exports.deleteWishList = deleteWishList;
