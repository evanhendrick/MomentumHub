import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBoard,
  updateBoard,
  fetchBoards,
  deleteBoard,
} from "../app/slices/boardSlice";
import { Link } from "react-router";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit, FaTools } from "react-icons/fa";
import _ from "lodash";

const BoardsView = () => {
  const dispatch = useDispatch();

  const [editingMode, setEditingMode] = useState(false);
  const [beingUpdated, setBeingUpdated] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(true);

  const boards = useSelector((state) => {
    return state.storeBoards.boards;
  });

  const localUser = JSON.parse(localStorage.getItem("currentUser"));

  setTimeout(() => {
    setLoading(false);
  }, 500);

  if (loading) {
    return <div>loading...</div>;
  }

  const handleSetCurrentBoard = async (id) => {
    await dispatch(fetchBoard(id));
  };

  const handleEditingBoard = async (board) => {
    await setBeingUpdated(board);
    setEditedText(board.name);
    setEditingMode(true);
  };

  const handleSaveEdit = async () => {
    await dispatch(updateBoard({ beingUpdated, editedText }));
    setEditingMode(false);
    await dispatch(fetchBoards(localUser._id));
  };

  const handleBoardDelete = async (boardId) => {
    await dispatch(deleteBoard(boardId));
    await dispatch(fetchBoards(localUser._id));
  };

  if (editingMode === false) {
    return (
      <div className="row">
        {boards.map((board) => {
          return (
            <Link
              style={{}}
              to={`/boards/${board._id}`}
              key={board._id}
              onClick={() => {
                handleSetCurrentBoard(board._id);
              }}
            >
              <div className="board-style shadow" key={board._id}>
                <h4 className="navbar">{board.name}</h4>
                <div className="container-fluid">
                  <table className="table w-100 table-bordered">
                    <thead>
                      <tr>
                        <th>Completion Date:</th>
                        <th>Completion Percentage %</th>
                        <th>Projects</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {board.dueDate ? (
                          <td className="badge">{board.dueDate}</td>
                        ) : (
                          <td>No Deadline Set</td>
                        )}
                        <td>
                          <FaTools /> In Progress
                        </td>
                        {!_.isEmpty(board.projects) ? (
                          <td>
                            {board.projects.map((proj) => {
                              return <p key={proj._id}>{proj.name}</p>;
                            })}
                          </td>
                        ) : (
                          <td>No projects yet</td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-inline-flex gap-2 ">
                  <button
                    className="btn btn-danger btn-sm board-buttons"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleBoardDelete(board._id);
                    }}
                  >
                    <FaTrashCan />
                  </button>
                  <button
                    className="btn btn-warning btn-sm board-buttons"
                    title="Edit Board"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleEditingBoard(board);
                    }}
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="mt-3 input-group alert alert-warning">
          We are now in editing mode
        </div>
        <input
          className="form-control mb-3"
          type="text"
          value={editedText}
          onChange={(e) => {
            setEditedText(e.target.value);
          }}
        ></input>
        <button
          className="btn btn-warning"
          onClick={() => {
            handleSaveEdit();
          }}
        >
          Finish Updating
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            setEditingMode(false);
          }}
        >
          Cancel
        </button>
      </div>
    );
  }
};

export default BoardsView;
