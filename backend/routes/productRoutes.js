import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddelware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  searchProductController,
  productCategoryController,
  updateProductController,
  submitAssignmentController,
} from "../controllers/productController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

//create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  upload,
  createProductController
);

//grt all products
router.get("/get-products", getProductsController);

//get single product
router.get("/get-product/:slug", getProductController);

//update product
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  upload,
  updateProductController
);

//delete product
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//search product
router.get("/search/:keyword", searchProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments
router.post(
  "/assignments/submit",
  requireSignIn,
  upload,
  submitAssignmentController
);

export default router;
