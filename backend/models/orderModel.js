import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
    document: {
      type: String,
      required: true,
    },
    buyer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    marks: {
      type: Number,
      default: 0, // Default value set to 0
    },
    status: {
      type: String,
      default: "Unchecked",
      enum: ["Unchecked", "Checked"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

