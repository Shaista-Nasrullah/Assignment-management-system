import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/listStyles.css"

const AdminMenu = () => {
  return (
    <>
      <div className="cover">
        <ul className="ul-list">
          <h3>Admin Panel</h3>
          <NavLink
            to="/dashboard/admin/create-category"
            className="list"
          >
            Create Course
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="list"
          >
            Create Assignment
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className="list"
          >
            Assignments
          </NavLink>
          <NavLink
            to="/dashboard/admin/all-assignments"
            className="list"
          >
            Submitted Assignments
          </NavLink>
          <NavLink
            to="/dashboard/admin/users"
            className="list"
          >
            Students
          </NavLink>
        </ul>
      </div>
    </>
  );
};

export default AdminMenu;
