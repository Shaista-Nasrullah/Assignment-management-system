import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select, Input } from "antd";
import OrderSearch from "../../components/Form/OrderSearch";

const { Option } = Select;

const AllAssignments = () => {
  const [statusOptions, setStatusOptions] = useState(["Unchecked", "Checked"]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [updatedOrders, setUpdatedOrders] = useState([]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-orders`
      );
      setOrders(data);

      // Initialize updated orders state
      const initialUpdatedOrders = data.map((order) => ({
        id: order._id,
        status: order.status,
        marks: order.marks,
      }));
      setUpdatedOrders(initialUpdatedOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

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

  const handleUpdate = async (orderId) => {
    const updatedOrder = updatedOrders.find((order) => order.id === orderId);
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,
        {
          status: updatedOrder.status,
          marks: updatedOrder.marks,
        }
      );
      toast.success("Assignment updated successfully!");
      getOrders(); // Refresh the data
    } catch (error) {
      console.log(error);
      toast.error("Failed to update assignment.");
    }
  };

  const handleFieldChange = (orderId, field, value) => {
    setUpdatedOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, [field]: value } : order
      )
    );
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Assignments</h1>
          <OrderSearch />
          {orders?.length > 0 ? (
            orders.map((order, index) => {
              const updatedOrder = updatedOrders.find(
                (o) => o.id === order._id
              );
              return (
                <div className="border shadow mb-3" key={order._id || index}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Marks</th>
                        <th>Status</th>
                        <th>Buyer</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={updatedOrder?.marks || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                order._id,
                                "marks",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <Select
                            bordered={false}
                            value={updatedOrder?.status || ""}
                            onChange={(value) =>
                              handleFieldChange(order._id, "status", value)
                            }
                          >
                            {statusOptions.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{order?.buyer?.name}</td>
                        <td>
                          {order?.createdAt
                            ? moment(order.createdAt).fromNow()
                            : "N/A"}
                        </td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => handleUpdate(order._id)}
                          >
                            Update
                          </button>
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
                            <p className="text-muted mt-2">
                              No file available
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No Assignments found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllAssignments;
