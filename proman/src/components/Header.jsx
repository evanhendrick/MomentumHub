import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/MomentumHubLogoSmall.png";

export const Header = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("currentUser", null);
    navigate("/");
  };
  return (
    <nav
      className="navbar navbar-expand-lg bg-dark"
      style={{
        marginBottom: 20,
      }}
    >
      <div className="container-fluid">
        <div className="d-inline-flex">
          <img
            src={logo}
            width={50}
            height={50}
            style={{ marginRight: 10 }}
          ></img>
          <h3 style={{ color: "white" }}>Welcome, {currentUser.username}</h3>
        </div>
        <button
          className="btn btn-success"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
