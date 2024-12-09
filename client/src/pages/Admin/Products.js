import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-products`
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Handle viewing or downloading the file
  const handleFileAction = (fileUrl, isPdf) => {
    if (fileUrl) {
      if (isPdf) {
        // Open PDF in a new browser tab
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      } else {
        // Trigger direct download for non-PDF files
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileUrl.split("/").pop(); // Extract file name from URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      toast.error("No file available");
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Assignments List</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                <div className="card-body">
                  <Link
                    key={p._id}
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="product-link"
                  >
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                  </Link>
                  {p.document && (
                    <>
                      {p.document.endsWith(".pdf") ? (
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => handleFileAction(p.document, true)}
                        >
                          View File
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary mt-2"
                          onClick={() => handleFileAction(p.document, false)}
                        >
                          Download File
                        </button>
                      )}
                    </>
                  )}
                  {!p.document && (
                    <p className="text-muted mt-2">No file available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;

