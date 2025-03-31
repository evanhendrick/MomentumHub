import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchBoards } from "../app/slices/boardSlice";
import { BoardStyle } from "./BoardStyle";
import App from "../App";
import Signup from "./Signup";
import BoardsView from "./BoardsView";
import { ProjectsView } from "./ProjectsView";
import { ProjectStyle } from "./ProjectStyle";

export const Nav = () => {
  // const dispatch = useDispatch();

  // const boards = useSelector((state) => {
  //   return state.storeBoards.boards;
  // });

  // useEffect(() => {
  //   dispatch(fetchBoards());
  // }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/user" element={<App />}/>
        <Route path="/boards/:board" element={<BoardStyle />} />
        {/* <Route path="/boards/:board" element={<BoardsView />}/> */}
        {/* <Route path="/projects/:project" element={<ProjectStyle />}/> */}
      </Routes>
    </BrowserRouter>
  );
};