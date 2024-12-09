import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import "../styles/home.css";
import axios from "axios";
import toast from "react-hot-toast";
import MainMenu from "../components/Layout/MainMenu";

const HomePage = () => {
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
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      } else {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileUrl.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      toast.error("No file available");
    }
  };

  return (
    <Layout title={"Home Page"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <MainMenu />
          </div>
          <div className="col-md-9 assignment-list-wrapper">
            {products?.map((p) => (
              <div className="assignment-item" key={p._id}>
                {/* Use Link directly for navigation */}
                <Link to={`/product/${p.slug}`} className="product-link">
                  <h5 className="card-title">{p.name}</h5>
                </Link>

                {p.document ? (
                  p.document.endsWith(".pdf") ? (
                    <button
                      className="btn1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction(p.document, true);
                      }}
                    >
                      View File
                    </button>
                  ) : (
                    <button
                      className="btn1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction(p.document, false);
                      }}
                    >
                      Download File
                    </button>
                  )
                ) : (
                  <span className="no-file">No file available</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
