import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllStudentsController,
  searchOrderController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddelware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//forgot password
router.post("/forgot-password", forgotPasswordController);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Amin route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//All orders
//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

//all students
router.get("/all-students", requireSignIn, isAdmin, getAllStudentsController);

//search product
router.get("/search-order/:keyword", requireSignIn, isAdmin, searchOrderController);

// router.get("/search-order/:keyword", (req, res, next) => {
//   console.log("Request received at /search-order/:keyword");
//   console.log("Keyword:", req.params.keyword);
//   next(); // Pass the request to the next middleware or controller
// }, requireSignIn, isAdmin, searchOrderController);


export default router;
