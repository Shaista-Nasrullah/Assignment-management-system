import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalMarks, setTotalMarks] = useState();
  const [document, setDocument] = useState(null); // State to store the uploaded document
  const [id, setId] = useState("");

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios(
        `${process.env.REACT_APP_API}/api/v1/category/categories`
      );
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting categories");
    }
  };

  // Fetch existing assignment details
  const getAssignmentDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      if (data?.success) {
        setName(data.product.name);
        setDescription(data.product.description);
        setTotalMarks(data.product.totalMarks);
        setCategory(data.product.category._id);
        setId(data.product._id);
        //setCategory(category?._id); // Set category ID
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching assignment details");
    }
  };

  useEffect(() => {
    getAllCategory();
    getAssignmentDetails();
  }, []);

  // Update assignment function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("category", category);
      if (totalMarks) {
        productData.append("totalMarks", totalMarks);
      }
      if (document) {
        productData.append("document", document); // Append document if updated
      }

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success("Assignment Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating assignment");
    }
  };

  //delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt(
        "Are You Sure want to delete this Assignment ? "
      );
      if (!answer) return;
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`
      );
      toast.success("Product Deleted Succfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Update Assignment"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Assignment</h1>
            <div className="m-1">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                value={category}
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="Write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="Number"
                  value={totalMarks || ""}
                  placeholder="Total Marks"
                  className="form-control"
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </div>

              {/* Document Upload Input */}
              <div className="mb-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="form-control"
                  onChange={(e) => setDocument(e.target.files[0])}
                />
              </div>

              <div className="mb-3">
                <button className="btn-primary" onClick={handleUpdate}>
                  UPDATE ASSIGNMENT
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                  DELETE ASSIGNMENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
