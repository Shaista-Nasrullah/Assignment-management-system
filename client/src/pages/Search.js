import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const Search = () => {
  const [values, setValues] = useSearch();

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
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Resuts</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
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

export default Search;
