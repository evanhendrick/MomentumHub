import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BoardStyle } from "./BoardStyle";
import App from "../App";
import Login from "./Signup";
import BoardsView from "./BoardsView";
import Signup from "./Signup";
import { NewUser } from "./newUser";

export const Nav = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<NewUser />} />
        <Route path="/user" element={<App />} />
        <Route path="/boards/:board" element={<BoardStyle />} />
      </Routes>
    </BrowserRouter>
  );
};
