import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    document: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
