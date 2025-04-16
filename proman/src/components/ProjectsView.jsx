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
import { ProjectTimer } from "./ProjectTimer";

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
    return state.storeProjects;
  });

  const handleGetCurrentProjects = () => {
    if (!currentBoard) {
      return <div>no current board</div>;
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
    if (_.isEmpty(projectText)) {
      alert("project must have a name")
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
      <div className="container mt-4">
        <div className="alert alert-info">Currently in editing mode</div>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            value={editedText}
            onChange={(e) => {
              setEditedText(e.target.value);
            }}
          ></input>
        </div>

        <button
          className="btn btn-primary me-2"
          onClick={() => {
            handleUpdateProject();
          }}
        >
          Update
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setEditingMode(false)}
        >
          Cancel
        </button>
      </div>
    );
  };

  if (editingMode === true) {
    return renderEditingMode();
  }

  if (!_.isEmpty(currentBoard) && _.isEmpty(currentProjects.projects)) {
    return (
      <div className="container mt-4">
        <h4 className="mb-3">{currentBoard.name}</h4>
        <div className="input-group mb-3">
          <input
            className="form-control"
            type="text"
            value={projectText}
            placeholder="Enter project name"
            onChange={(e) => setProjectText(e.target.value)}
          ></input>
          <button
            className="btn btn-success"
            onClick={() => {
              handlePostProject();
            }}
          >
            Create New Project
          </button>
        </div>
        <div className="alert alert-warning">
          No projects for this board yet
        </div>
      </div>
    );
  } else if (!_.isEmpty(currentBoard) && !_.isEmpty(currentProjects.projects)) {
    return (
      <div className="container mt-4">
        <h4 className="mb-3">{currentBoard.name}</h4>
        <div className="input-group mb-4">
          <input
            className="form-control"
            type="text"
            value={projectText}
            placeholder="Enter project name"
            onChange={(e) => setProjectText(e.target.value)}
          ></input>
          <button
            className="btn btn-success"
            onClick={() => {
              handlePostProject();
            }}
          >
            Create New Project
          </button>
        </div>

        <div>
          <div className="row g-3">
            {currentProjects.projects.map((proj) => {
              return (
                <div className="col-md-4" key={proj._id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{proj.name}</h5>
                      <div className="d-flex justify-content-between align">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditingProject(proj)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            handleDeleteProject(proj._id);
                          }}
                        >
                          <FaTrashCan />
                        </button>
                      </div>
                      <hr />
                      <TaskView proj={proj} />
                      <hr />
                      <ProjectTimer proj={proj}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
        </div>
          <span className="text-primary">Loading...</span>
      </div>
    );
  }
};
