import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { postTask, updateTask } from "../app/slices/taskSlice";
import { deleteTask } from "../app/slices/taskSlice";
import { fetchProjects } from "../app/slices/projectSlice";
import _ from "lodash";
import { FaTrashCan } from "react-icons/fa6";

export const TaskView = (props) => {
  const dispatch = useDispatch();
  const [taskText, setTaskText] = useState("");

  const [editingMode, setEditingMode] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [beingEdited, setBeingEdited] = useState(null);

  const handleAddTask = async () => {
    await dispatch(postTask({ projId: props.proj._id, taskName: taskText }));
    await dispatch(fetchProjects(props.proj.board));
    setTaskText("");
  };

  const handleDeleteTask = async (taskId) => {
    await dispatch(deleteTask(taskId));
    await dispatch(fetchProjects(props.proj.board));
  };

  const handleEditTask = (task) => {
    setEditedText(task.name);
    setBeingEdited(task);
    setEditingMode(true);
  };

  const handleUpdateTask = async () => {
    await dispatch(updateTask({ taskId: beingEdited._id, text: editedText }));
    setEditingMode(false);
    await dispatch(fetchProjects(props.proj.board));
  };

  const tasksArray = props.proj.tasks;

  if (editingMode === true) {
    return (
      <div className="container mt-2">
        <div className="alert alert-info p-2">Currently Editing a Task</div>
        <div className="input-group mb-2">
          <input
            className="form-control"
            type="text"
            value={editedText}
            onChange={(e) => {
              setEditedText(e.target.value);
            }}
          ></input>
          <button
            className="btn btn-primary"
            onClick={() => {
              handleUpdateTask();
            }}
          >
            Update
          </button>
        </div>
      </div>
    );
  }

  if (_.isEmpty(tasksArray)) {
    return (
      <div className="container mt-2">
        <div className="input-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="set new task"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          ></input>
          <button
            className="btn btn-success"
            onClick={() => {
              handleAddTask();
            }}
          >
            Add Task
          </button>
        </div>
        <div className="alert alert-warning">No Tasks Yet.</div>
      </div>
    );
  } else {
    return (
      <div className="container mt-2">
        <div className="input-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="set new task"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          ></input>
          <button
            className="btn btn-success"
            onClick={() => {
              handleAddTask();
            }}
          >
            Add Task
          </button>
        </div>
        <ul className="list-group">
          {tasksArray.map((task) => {
            return (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={task._id}
              >
                <div className="form-check">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                  ></input>
                  <span
                    className="me-2"
                    onClick={() => handleEditTask(task)}
                    style={{ cursor: "pointer" }}
                  >
                    {task.name}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      handleDeleteTask(task._id);
                    }}
                  >
                    <FaTrashCan />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};
