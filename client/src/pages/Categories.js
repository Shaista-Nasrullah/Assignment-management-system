import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import MainMenu from "../components/Layout/MainMenu";
const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Courses"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <MainMenu />
          </div>
          <div className="col-md-9">
            {categories.map((c) => (
              <div className="col-md-6 mt-5 mb-3 gx-3 gy-3" key={c._id}>
                <Link to={`/category/${c.slug}`} className="btn btn-primary">
                  {c.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
