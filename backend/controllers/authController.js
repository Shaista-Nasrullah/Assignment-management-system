import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      course,
      semester,
      enrollment,
      password,
      phone,
      answer,
    } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!course) {
      return res.send({ message: "Course is required" });
    }
    if (!semester) {
      return res.send({ message: "Semester is required" });
    }
    if (!enrollment) {
      return res.send({ message: "Enrollment Number is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, Please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);

    //register user
    const user = await new userModel({
      name,
      email,
      course,
      semester,
      enrollment,
      phone,
      answer,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Student registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Please register first",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//test controller
export const testController = async (req, res) => {
  res.send("protected Route");
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const {
      name,
      email,
      course,
      semester,
      enrollment,
      phone,
      password,
      answer,
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!course) {
      return res.status(400).send({ message: "Course is required" });
    }
    if (!semester) {
      return res.status(400).send({ message: "Semester is required" });
    }
    if (!enrollment) {
      return res.status(400).send({ message: "Enrollment Number is required" });
    }
    if (!phone) {
      return res.status(400).send({ message: "Phone Number is required" });
    }

    // Find the user by ID
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.course = course || user.course;
    user.semester = semester || user.semester;
    user.enrollment = enrollment || user.enrollment;
    user.phone = phone || user.phone;

    // Handle password update
    if (password) {
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
    }

    // Update answer if provided
    if (answer) {
      user.answer = answer;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//All orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

// order status and marks update
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, marks } = req.body;

    // Validate marks if provided
    if (marks !== undefined && (marks < 0 || marks > 100)) {
      return res.status(400).send({
        success: false,
        message: "Marks should be between 0 and 100.",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status, ...(marks !== undefined && { marks }) },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating order.",
      error,
    });
  }
};

//All students
export const getAllStudentsController = async (req, res) => {
  try {
    const students = await userModel.find({});
    res.status(200).json({
      success: true,
      totalStudents: students.length,
      message: "List of students",
      students,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting students",
    });
  }
};

export const searchOrderController = async (req, res) => {
  try {
    const keyword = decodeURIComponent(req.params.keyword);
    // console.log("searchOrderController called");
    // console.log("Decoded keyword:", keyword);

    // Determine query type based on keyword format
    let buyerQuery = {};
    if (/^\d+$/.test(keyword)) {
      buyerQuery = { enrollment: keyword }; // Searching by enrollment number
      // console.log("Searching by enrollmentNumber:", buyerQuery);
    } else if (/^[a-zA-Z\s]+$/.test(keyword)) {
      buyerQuery = { name: { $regex: keyword, $options: "i" } }; // Searching by name
      // console.log("Searching by name:", buyerQuery);
    } else {
      // console.error("Invalid keyword format:", keyword);
      return res.status(400).send({
        success: false,
        message: "Invalid keyword format. Use either letters or digits.",
      });
    }

    // Fetch orders with matching buyers
    const ourresults = await orderModel
      .find({})
      .populate({
        path: "buyer",
        match: buyerQuery, // Filter by buyer query here
        select: "name enrollment", // Only return name and enrollment fields
      })
      .select("-photo"); // Exclude photo if unnecessary

    // console.log("Search results after populate:", ourresults);

    // Filter results to exclude orders with null buyers
    const filteredResults = ourresults.filter((order) => order.buyer !== null);

    res.json(filteredResults);
  } catch (error) {
    console.error("Error in searchOrderController:", error);
    res.status(500).send({
      success: false,
      message: "Error in Search Order API",
      error: error.message,
    });
  }
};
