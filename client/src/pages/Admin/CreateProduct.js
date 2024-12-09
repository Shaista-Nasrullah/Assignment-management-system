import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalMarks, setTotalMarks] = useState();
  const [document, setDocument] = useState(null); // State to store the uploaded document

  // Get all categories
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

  useEffect(() => {
    getAllCategory();
  }, []);

  // Create product (assignment) function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("category", category);
      if (totalMarks) {
        productData.append("totalMarks", totalMarks); // Append document to FormData if uploaded
      }
      if (document) {
        productData.append("document", document); // Append document to FormData if uploaded
      }

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/create-product`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct headers for file upload
          },
        }
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Assignment Created Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Assignment</h1>
            <div className="m-1">
              <Select
                bordered={false}
                placeholder="Select a course"
                size="large"
                showSearch
                className="form-select mb-3"
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
                  value={totalMarks}
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
                  onChange={(e) => setDocument(e.target.files[0])} // Handle document upload
                />
              </div>

              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE ASSIGNMENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
