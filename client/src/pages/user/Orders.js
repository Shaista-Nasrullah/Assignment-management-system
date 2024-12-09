import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth(); // Removed unnecessary `setAuth`

  // Fetch orders from the API
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/orders`
      );
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Handle viewing or downloading files
  const handleFileAction = (fileUrl, isPdf) => {
    if (fileUrl) {
      const fileName = fileUrl.split("/").pop();
      if (isPdf) {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      } else {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      toast.error("No file available");
    }
  };

  return (
    <Layout title="Your Assignments">
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1>All Assignments</h1>
            {orders?.length > 0 ? (
              orders.map((order, index) => (
                <div className="border shadow mb-3" key={order._id || index}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Marks</th>
                        <th>Status</th>
                        <th>Student</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{order?.marks}</td>
                        <td>{order?.status}</td>
                        <td>{order?.buyer?.name}</td>
                        <td>
                          {order?.createdAt
                            ? moment(order.createdAt).fromNow()
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {order?.products?.map((product) => (
                      <div
                        className="row mb-2 p-3 card flex-row"
                        key={product._id}
                      >
                        <div className="col-md-8">
                          <p className="fw-bold">
                            Assignment Name: {product.name}
                          </p>
                          <p>
                            Assignment Description:{" "}
                            {product.description.substring(0, 30)}
                          </p>
                          <p>Total Marks: {product.totalMarks}</p>
                          {product.document ? (
                            product.document.endsWith(".pdf") ? (
                              <button
                                className="btn btn-primary mt-2"
                                onClick={() =>
                                  handleFileAction(product.document, true)
                                }
                              >
                                View File
                              </button>
                            ) : (
                              <button
                                className="btn btn-secondary mt-2"
                                onClick={() =>
                                  handleFileAction(product.document, false)
                                }
                              >
                                Download File
                              </button>
                            )
                          ) : (
                            <p className="text-muted mt-2">No file available</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No Assignments found.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
