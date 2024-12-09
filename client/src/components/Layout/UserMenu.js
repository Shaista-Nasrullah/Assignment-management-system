import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/listStyles.css";

const UserMenu = () => {
  return (
    <>
      <div className="cover">
        <ul className="list-group">
          <h3>User Panel</h3>
          <NavLink
            to="/dashboard/user/profile"
            className="list"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="list"
          >
            Assignments
          </NavLink>
        </ul>
      </div>
    </>
  );
};

export default UserMenu;
