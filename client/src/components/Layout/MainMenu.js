import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/listStyles.css";

const MainMenu = () => {
  return (
    <>
      <div className="cover">
        <ul className="ul-list">
          <li className="list">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="list">
            <NavLink to="/cv">CV</NavLink>
          </li>
          <li className="list">
            <NavLink to="/categories">Courses</NavLink>
          </li>
          <li className="list">
            <NavLink to="/publications">Publications</NavLink>
          </li>
          <li className="list">
            <NavLink to="/contact">Contact Us</NavLink>
          </li>
        </ul>
      </div>
      {/* <div className="text-center">
        <div className="list-group">
          
          <NavLink
            to="/a"
            className="list-group-item list-group-item-action"
          >
            CV
          </NavLink>
          <NavLink
            to="/b"
            className="list-group-item list-group-item-action"
          >
            Examination
          </NavLink>
          <NavLink
            to="/c"
            className="list-group-item list-group-item-action"
          >
            Publications
          </NavLink>
          <NavLink
            to="/d"
            className="list-group-item list-group-item-action"
          >
            Students
          </NavLink>
        </div>
      </div> */}
    </>
  );
};

export default MainMenu;
