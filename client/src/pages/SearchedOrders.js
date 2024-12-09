// import React, { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import AdminMenu from "../components/Layout/AdminMenu";
// import Layout from "../components/Layout/Layout";
// import moment from "moment";
// import { Select, Input } from "antd";
// import OrderSearch from "../components/Form/OrderSearch";

// const { Option } = Select;

// const SearchedOrders = () => {
//   const [status] = useState(["Unchecked", "Checked"]);
//   const [orders, setOrders] = useState([]); // State to store search results

//   // Handle file view or download action
//   const handleFileAction = (fileUrl, isPdf) => {
//     if (fileUrl) {
//       const fileName = fileUrl.split("/").pop();
//       if (isPdf) {
//         window.open(fileUrl, "_blank", "noopener,noreferrer");
//       } else {
//         const link = document.createElement("a");
//         link.href = fileUrl;
//         link.download = fileName;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     } else {
//       toast.error("No file available");
//     }
//   };

//   // Update order marks or status
//   const handleChange = async (orderId, statusValue, marksValue) => {
//     try {
//       const { data } = await axios.put(
//         `${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,
//         {
//           status: statusValue,
//           marks: marksValue,
//         }
//       );
//       toast.success("Order updated successfully!");
//       // Refresh orders after update
//       const updatedOrders = orders.map((order) =>
//         order._id === orderId
//           ? { ...order, status: statusValue, marks: marksValue }
//           : order
//       );
//       setOrders(updatedOrders);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update order.");
//     }
//   };

//   return (
//     <Layout title={"All Orders Data"}>
//       <div className="row dashboard">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center">All Assignments</h1>
//           <OrderSearch
//             onSearch={(results) => setOrders(results)} // Pass data from OrderSearch
//           />
//           {orders.length > 0 ? (
//             orders.map((order, index) => (
//               <div className="border shadow mb-3" key={order._id || index}>
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Marks</th>
//                       <th>Status</th>
//                       <th>Buyer</th>
//                       <th>Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>{index + 1}</td>
//                       <td>
//                         <Input
//                           type="number"
//                           min={0}
//                           max={100}
//                           defaultValue={order?.marks || ""}
//                           onBlur={(e) =>
//                             handleChange(order._id, order.status, e.target.value)
//                           }
//                         />
//                       </td>
//                       <td>
//                         <Select
//                           bordered={false}
//                           onChange={(value) =>
//                             handleChange(order._id, value, order.marks)
//                           }
//                           defaultValue={order?.status}
//                         >
//                           {status.map((s, i) => (
//                             <Option key={i} value={s}>
//                               {s}
//                             </Option>
//                           ))}
//                         </Select>
//                       </td>
//                       <td>{order?.buyer?.name || "Unknown Buyer"}</td>
//                       <td>
//                         {order?.createdAt
//                           ? moment(order.createdAt).fromNow()
//                           : "N/A"}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <div className="container">
//                   {order?.products?.map((product) => (
//                     <div
//                       className="row mb-2 p-3 card flex-row"
//                       key={product._id || product.name}
//                     >
//                       <div className="col-md-8">
//                         <p className="fw-bold">
//                           Assignment Name: {product.name || "N/A"}
//                         </p>
//                         <p>
//                           Assignment Description:{" "}
//                           {product.description
//                             ? product.description.substring(0, 30)
//                             : "No description"}
//                         </p>
//                         <p>Total Marks: {product.totalMarks || "N/A"}</p>
//                         {product.document ? (
//                           product.document.endsWith(".pdf") ? (
//                             <button
//                               className="btn btn-primary mt-2"
//                               onClick={() =>
//                                 handleFileAction(product.document, true)
//                               }
//                             >
//                               View File
//                             </button>
//                           ) : (
//                             <button
//                               className="btn btn-secondary mt-2"
//                               onClick={() =>
//                                 handleFileAction(product.document, false)
//                               }
//                             >
//                               Download File
//                             </button>
//                           )
//                         ) : (
//                           <p className="text-muted mt-2">No file available</p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No Assignments found.</p>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default SearchedOrders;


import React from 'react'

const SearchedOrders = () => {
  return (
    <div>
      
    </div>
  )
}

export default SearchedOrders
