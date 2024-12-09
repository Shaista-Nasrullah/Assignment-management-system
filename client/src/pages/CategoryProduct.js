import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/style.css";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

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
    <Layout>
      <div className="container mt-3">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>

        <div className="container">
          <div className="row">
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

export default CategoryProduct;


