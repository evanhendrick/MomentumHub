import React from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { TaskView } from "./TaskView";

export const ProjectStyle = () => {
  const currentProject = useSelector((state) => {
    return state.storeProjects.currentProject[0];
  });

  console.log("Project style current project", currentProject);
  return (
    <div>
      <Link to="/user">Home</Link>
      <div>
        Our current project contains all of the tasks we have to get done
      </div>
      <div>
        <strong>Need to create Task Components</strong>
      </div>
      {/* <TaskView /> */}
    </div>
  );
};
