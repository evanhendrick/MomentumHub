import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  postProject,
  deleteProject,
  updateProject,
} from "../app/slices/projectSlice";
import { TaskView } from "./TaskView";
import _ from "lodash";
import { FaTrashCan } from "react-icons/fa6";

export const ProjectsView = () => {
  const [projectText, setProjectText] = useState("");

  const [editingMode, setEditingMode] = useState(false);
  const [beingUpdated, setBeingUpdated] = useState(null);
  const [editedText, setEditedText] = useState("");

  const dispatch = useDispatch();

  const currentBoard = useSelector((state) => {
    return state.storeBoards.currBoard;
  });
  const currentProjects = useSelector((state) => {
    return state.storeProjects.projects;
  });

  const handleGetCurrentProjects = () => {
    if (!currentBoard) {
      return (
        <div>no current board</div>
      )
    } else {
      dispatch(fetchProjects(currentBoard._id));
    }
  };

  useEffect(() => {
    if (!_.isEmpty(currentBoard)) {
      handleGetCurrentProjects();
    }
  }, [currentBoard]);

  const handlePostProject = async () => {
    if(_.isEmpty(projectText)){
      console.log("project must have a name")
      // state for input error
      // setProjectText("Error: must enter a name")
    } else {
      const data = {
        projectText: projectText,
        boardId: currentBoard._id,
      };
      await dispatch(postProject(data));
      await dispatch(fetchProjects(currentBoard._id));
      setProjectText("");
    }
  };

  const handleDeleteProject = async (projId) => {
    await dispatch(deleteProject(projId));
    await dispatch(fetchProjects(currentBoard._id));
  };

  const handleUpdateProject = async () => {
    await dispatch(
      updateProject({ projId: beingUpdated._id, text: editedText })
    );
    await dispatch(fetchProjects(currentBoard._id));
    setBeingUpdated(null);
    setEditedText("");
    setEditingMode(false);
  };

  const handleEditingProject = (proj) => {
    setEditedText(proj.name);
    setBeingUpdated(proj);
    setEditingMode(true);
  };

  const renderEditingMode = () => {
    return (
      <div>
        Currently in editing mode
        <input
          type="text"
          value={editedText}
          onChange={(e) => {
            setEditedText(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            handleUpdateProject();
          }}
        >
          Update
        </button>
      </div>
    );
  };

  if (editingMode === true) {
    return renderEditingMode();
  }

  if (!_.isEmpty(currentBoard) && _.isEmpty(currentProjects)) {
    return (
      <div>
        <div>
          <b>{currentBoard.name}</b>
        </div>
        <input
          type="text"
          value={projectText}
          placeholder="Enter project name"
          onChange={(e) => setProjectText(e.target.value)}
        ></input>
        <button
          onClick={() => {
            handlePostProject();
          }}
        >
          Create New Project
        </button>
        <div>No projects for this board yet</div>
      </div>
    );
  } else if (!_.isEmpty(currentBoard) && !_.isEmpty(currentProjects)) {
    return (
      <div>
        <div>
          <b>{currentBoard.name}</b>
        </div>
        <input
          type="text"
          value={projectText}
          placeholder="Enter project name"
          onChange={(e) => setProjectText(e.target.value)}
        ></input>
        <button
          onClick={() => {
            handlePostProject();
          }}
        >
          Create New Project
        </button>
        <div>
          <div className="row">
            {currentProjects.map((proj) => {
              return (
                <div className="col-3 project-column" key={proj._id}>
                  <h3 className="project-header">{proj.name}</h3>
                  <button onClick={() => handleEditingProject(proj)}>
                    Edit
                  </button>
                  <button
                    className="project-header"
                    onClick={() => {
                      handleDeleteProject(proj._id);
                    }}
                  >
                    <FaTrashCan />
                  </button>
                  <TaskView proj={proj} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};
