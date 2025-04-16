import React from "react";
import { Link } from "react-router-dom";
import { ProjectsView } from "./ProjectsView";

export const BoardStyle = () => {
  return (
    <div className="">
      <Link to="/user" onClick={() => {}}>
        Home
      </Link>
      <ProjectsView />
    </div>
  );
};
