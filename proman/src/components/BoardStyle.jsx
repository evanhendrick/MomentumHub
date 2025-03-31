import React from "react";
import { Link } from "react-router-dom";
import { ProjectsView } from "./ProjectsView";

export const BoardStyle = () => {

  return (
    <div>
      <Link
        to="/user"
        onClick={() => {
          console.log("Go home");
        }}
      >
        Home
      </Link>
      <ProjectsView />
    </div>
  );
};