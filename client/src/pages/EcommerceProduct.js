import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/home.css";
import MainMenu from "../components/Layout/MainMenu";

const EcommerceProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [document, setDocument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );

      if (!data?.product) {
        alert("Product not found");
        navigate("/"); // Redirect to the home page if the product doesn't exist
        return;
      }

      setProduct(data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product details. Please try again.");
    }
  };
  // Handle file selection
  const handleDocumentChange = (e) => {
    setDocument(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure a document is selected
    if (!document) {
      alert("Please upload a document.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("document", document);
      formData.append("productId", product._id);

      // Make API call
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/assignments/submit`, // Corrected endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Notify user
      alert("Assignment submitted successfully");
    } catch (error) {
      console.error("Error during submission:", error);
      alert(
        error.response?.data?.message ||
          "Error submitting assignment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  return (
    <Layout title={"Assignments"}>
      <div className="container-fluid m-3 p-3">
        <div className="col-md-3">
          <MainMenu />
        </div>
        <div className="container col-md-9 mx-10">
          <h4>Assignment Name: {product?.name || "No Assignment Name"}</h4>
          <br />
          <p>
            Assignment Description:{" "}
            {product?.description || "No Description Available"}
          </p>
          {product?.totalMarks ? (
            <p>Total Marks: {product.totalMarks}</p>
          ) : null}

          {/* Document Upload Input */}
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentChange}
                  required
                />
              </div>
              <div>
                <button className="btn mt-5" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EcommerceProduct;
