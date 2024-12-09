import { uploadOnCloudinary } from "../helpers/cloudinary.js";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import Order from "../models/orderModel.js"; // Ensure the correct path is used
import slugify from "slugify";
//import { uploadOnCloudinary } from "./cloudinaryUpload";
// Import cloudinary upload function

export const createProductController = async (req, res) => {
  try {
    const { name, description, totalMarks, category } = req.body;

    // Check if all required fields are provided
    if ([name, description, category].some((field) => field?.trim() === "")) {
      return res.status(400).send({
        message: "All fields are required!",
      });
    }

    // Check if a product already exists with the same name or description
    const existingProduct = await productModel.findOne({
      $or: [{ name }, { description }],
    });

    if (existingProduct) {
      return res.status(409).send({
        success: true,
        message: "Assignment already exists with this name or description",
      });
    }

    // Check if a document is provided and upload it to Cloudinary
    let documentUrl = null;
    if (req.file && req.file.path) {
      // Assuming only one file (document)
      documentUrl = await uploadOnCloudinary(req.file.path);
      console.log(documentUrl);
    }

    if (!documentUrl) {
      return res.status(400).send({
        message: "Error uploading the document",
      });
    }

    // Create the product in the database with the uploaded document's URL
    const product = await productModel.create({
      name,
      slug: slugify(name),
      description,
      totalMarks,
      category,
      document: documentUrl.url, // Save Cloudinary URL of the document
    });

    return res.status(201).send({
      success: true,
      message: "New Assignment created!",
      product,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while creating product",
    });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category");
    res.status(200).json({
      success: true,
      totalProducts: products.length,
      message: "List of products",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};

//get single product
export const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting single product",
    });
  }
};

//updating assignment
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params; // Assignment ID from URL
    const { name, description, totalMarks, category } = req.body;

    // Check if the ID is provided
    if (!id) {
      return res.status(400).send({
        message: "Assignment ID is required!",
      });
    }

    // Check if the assignment exists
    const existingAssignment = await productModel.findById(id);
    if (!existingAssignment) {
      return res.status(404).send({
        success: false,
        message: "Assignment not found!",
      });
    }

    // Handle document upload if a new one is provided
    let documentUrl = existingAssignment.document; // Retain the old document by default
    if (req.file && req.file.path) {
      documentUrl = await uploadOnCloudinary(req.file.path);
      if (!documentUrl) {
        return res.status(400).send({
          message: "Error uploading the document",
        });
      }
      documentUrl = documentUrl.url; // Get Cloudinary URL
    }

    // Update assignment details
    const updatedAssignment = await productModel.findByIdAndUpdate(
      id,
      {
        name: name || existingAssignment.name,
        slug: name ? slugify(name) : existingAssignment.slug, // Update slug if name changes
        description: description || existingAssignment.description,
        totalMarks: totalMarks || existingAssignment.totalMarks,
        category: category || existingAssignment.category,
        document: documentUrl, // Updated or retained document URL
      },
      { new: true } // Return updated document
    );

    return res.status(200).send({
      success: true,
      message: "Assignment updated successfully!",
      updatedAssignment,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while updating assignment",
    });
  }
};


//delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting assignment",
      error: error.message,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

export const submitAssignmentController = async (req, res) => {
  try {
    // Ensure that a file is uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Document is required." });
    }

    // Upload document to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    // Extract the URL from the Cloudinary response
    const documentUrl = cloudinaryResponse.secure_url || cloudinaryResponse.url;
    if (!documentUrl) {
      return res.status(500).json({ error: "Failed to upload document to Cloudinary." });
    }

    // Validate productId in request body
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    // Create a new order in the database with the uploaded document URL
    const order = new Order({
      products: [productId], // Use productId directly
      document: documentUrl, // Store the URL, not the entire object
      buyer: req.user._id, // Assuming user is authenticated and `req.user._id` is available
      marks: 0, // Marks default to 0 initially
    });

    await order.save();

    // Respond with success
    res.json({ message: "Assignment submitted successfully" });
  } catch (error) {
    console.error("Error in submitAssignmentController:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};
