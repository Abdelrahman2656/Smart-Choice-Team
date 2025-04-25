import { Laptop, Mobile, Tablet, Tv, User } from "../../../Database";
import { AuthenticatedRequest } from "../../Middleware/authorization";
import { AppError } from "../../Utils/AppError/AppError";
import { messages } from "../../Utils/constant/messages";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";
//---------------------------------------------------add wishlist--------------------------------------------------------------
export const addWishList = async (
  req: AuthenticatedRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from body
  const { productId, modelType } = req.body as {
    productId: string;
    modelType: 'Mobile' | 'Tv' | 'Laptop' | 'Tablet';
  };
  const userId = req.authUser?._id;
  //check model
  if (!["Mobile", "Tv", "Laptop", "Tablet"].includes(modelType)) {
    return next(new AppError("Invalid Model", 500));
  }
  // Validate if product exists in its model collection
  const modelMap = {
    Mobile,
    Tv,
    Laptop,
    Tablet,
  };

  const model = modelMap[modelType];
  if (!model) {
    return next(new AppError("Model not found", 500));
  }

  const productExists = await model.findById(productId);
  if (!productExists) {
    return next(new AppError("Product not found for this model", 404));
  }
   // Check if the product already exists in the user's wishlist
   const existingWishListItem = await User.findOne({
    _id: userId,
    "wishList.productId": productId,
    "wishList.modelType": modelType,
  });

  if (existingWishListItem) {
    return next(new AppError("Product already in wishlist", 400));
  }
  //update
  const item = {
    productId,
    modelType,
  };
  const userUpdate = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { wishList: item } },
    { new: true }
  );
  console.log("Adding to wishlist:", item);
  //send response
  return res
    .status(201)
    .json({
      message: messages.wishlist.updateSuccessfully,
      success: true,
      userUpdate,
    });
};
//---------------------------------------------------get wishlist --------------------------------------------------------------
export const getWishlist = async (
    req: AuthenticatedRequest,
    res: AppResponse,
    next: AppNext
  ) => {
    const userId = req.authUser?._id;
    const user = await User.findById(userId, { wishList: 1 });
    if (!user) return next(new AppError("User not found", 404));
  
    // نلف على الـ wishlist
    const populatedWishlist = await Promise.all(
      user.wishList.map(async (item) => {
        let productData = null;
        switch (item.modelType) {
          case "Mobile":
            productData = await Mobile.findById(item.productId);
            break;
          case "Tv":
            productData = await Tv.findById(item.productId);
            break;
          case "Laptop":
            productData = await Laptop.findById(item.productId);
            break;
          case "Tablet":
            productData = await Tablet.findById(item.productId);
            break;
        }
  
        return {
            productId: item.productId,
            modelType: item.modelType,
            productData,
          };
      })
    );
  
    return res.status(200).json({ success: true, data: populatedWishlist });
  };
  
//---------------------------------------------------delete wishlist --------------------------------------------------------------
export const deleteWishList =async (
    req: AuthenticatedRequest,
    res: AppResponse,
    next: AppNext
  ) =>{
    //get data from req
    const {productId , modelType}=req.body
    const userId = req.authUser?._id
    // delete
    const item ={
        productId , modelType
    }
    const wishlistDeleted = await User.findByIdAndUpdate(userId,
        {$pull:{wishList:item}},
        {new:true}
    ).select("wishList")
    //send response 
    return res.status(200).json({message:"WishList Removed Successfully",success:true , data :wishlistDeleted})
  }