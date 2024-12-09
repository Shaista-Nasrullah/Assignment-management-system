import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import MainMenu from "../components/Layout/MainMenu";

const PageNotFound = () => {
  return (
    <Layout title={"Go Back - Page not found"}>
      <div className="container mt-20">
        <div className="col-md-3">
          <MainMenu />
        </div>
        <div className="pnf">
          <h1 className="pnf-title">404</h1>
          <h2>Oops ! Page Not Found</h2>
          <Link to="/" className="pnf-btn">
            Go back
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PageNotFound;
