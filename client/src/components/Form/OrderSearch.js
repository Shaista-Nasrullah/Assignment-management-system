import React, { useState, useEffect } from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { Select, Input } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

const OrderSearch = () => {
  const [values, setValues] = useSearch();
  const [statusOptions] = useState(["Unchecked", "Checked"]);
  const [orders, setOrders] = useState([]);
  const [editableOrders, setEditableOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-orders`
      );
      setOrders(data);
      setEditableOrders(
        data.map((order) => ({
          id: order._id,
          status: order.status || "Unchecked",
          marks: order.marks || 0,
        }))
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleFieldChange = (orderId, field, value) => {
    setEditableOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, [field]: value } : order
      )
    );
  };

  const handleUpdate = async (orderId) => {
    const updatedOrder = editableOrders.find((order) => order.id === orderId);
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,
        {
          status: updatedOrder.status,
          marks: updatedOrder.marks,
        }
      );
      toast.success("Order updated successfully!");
      getOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/search-order/${values.keyword}`
      );
      if (data?.length > 0) {
        setValues({ ...values, ourresults: data });
      } else {
        toast.error("No matching orders found");
      }
    } catch (error) {
      toast.error("An error occurred while searching orders");
    }
  };

  return (
    <div>
      <form
        className="d-flex search-form"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword || ""}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

      {/* Render search results */}
      <div className="mt-4">
        {values.ourresults && values.ourresults.length > 0 ? (
          values.ourresults.map((order, index) => {
            const editableOrder = editableOrders.find(
              (o) => o.id === order._id
            );
            return (
              <div key={order._id || index} className="border p-3 mb-3">
                <h5>Order #{index + 1}</h5>
                <p>
                  <strong>Buyer Name:</strong> {order.buyer?.name || "N/A"}
                </p>
                <p>
                  <strong>Buyer Enrollment:</strong>{" "}
                  {order.buyer?.enrollment || "N/A"}
                </p>
                <div className="mb-3">
                  <label>Status:</label>
                  <Select
                    bordered={false}
                    value={editableOrder?.status || "Unchecked"}
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
                </div>
                <div className="mb-3">
                  <label>Marks:</label>
                  <Input
                    type="number"
                    min={0}
                    max={100} // Adjust max marks as needed
                    value={editableOrder?.marks || ""}
                    onChange={(e) =>
                      handleFieldChange(order._id, "marks", e.target.value)
                    }
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdate(order._id)}
                >
                  Update Order
                </button>
                {order?.document && (
                  <div className="mb-3">
                    <label>Document:</label>
                    <button
                      className="btn btn-link"
                      onClick={() => window.open(order.document, "_blank")}
                    >
                      View Document
                    </button>
                  </div>
                )}
                <p>
                  <strong>Date:</strong>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-muted">
            No results to display. Try searching for an order.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSearch;
