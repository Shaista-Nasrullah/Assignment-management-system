import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import UserMenu from "../../components/Layout/UserMenu";
import "../../styles/listStyles.css"

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Dashboard - AMS"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="covers">
              <h3>Student Name : {auth?.user?.name}</h3>
              <h3>Student Email : {auth?.user?.email}</h3>
              <h3>Student Conatct : {auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
