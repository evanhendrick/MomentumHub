import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BoardStyle } from "./BoardStyle";
import App from "../App";
import Signup from "./Signup";
import { NewUser } from "./NewUser";

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
