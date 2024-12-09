import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Users = () => {
  const [students, setStudents] = useState([]);

  // Fetch all products
  const getAllStudents = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-students`
      );
      setStudents(data?.students);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Students</h1>
            {students.map((c) => (
              <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={c._id}>
                <div className="card">
                  <Link to={`/category/${c.slug}`} className="btn cat-btn">
                    <p>{c.name} </p>
                    {c.enrollment}
                    {c.course}
                    {c.semester}
                    {c.phone}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
