import React from "react";
import { useState, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBoard, updateBoard, fetchBoards, deleteBoard } from "../app/slices/boardSlice";
import { Link } from "react-router";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";


const BoardsView = () => {
  const dispatch = useDispatch();

  const [editingMode, setEditingMode] = useState(false);
  const [beingUpdated, setBeingUpdated] = useState(null)
  const [editedText, setEditedText] = useState('')

  const boards = useSelector((state) => {
    return state.storeBoards.boards;
  });
  const authState = useSelector((state) => {
    return state.authState
  })

  // do I need to send authHeaders with each request in order to validate user request so I can receive data from protected endpoint?
  console.log(authState)

  const handleSetCurrentBoard = async (id) => {
    await dispatch(fetchBoard(id));
  };

  const handleEditingBoard = async (board) => {
    await setBeingUpdated(board)
    setEditedText(board.name)
    setEditingMode(true)
  }

  const handleSaveEdit = async () => {
    dispatch(updateBoard({beingUpdated, editedText}))
    setEditingMode(false)
    await dispatch(fetchBoards())
  }

  const handleBoardDelete = async (boardId) => {
    await dispatch(deleteBoard(boardId))
    await dispatch(fetchBoards())
  }

if(editingMode === false){
  return (
    <div>
      {boards.map((board) => {
        return (
          <div className="row" key={board._id}>
            <div className="col-3">
            <button
              className="btn btn-danger"
              onClick={() => {handleBoardDelete(board._id)}}
              >
                <FaTrashCan />
              </button>
              <button className="btn btn-warning" title="Edit Board"
                onClick={() => {handleEditingBoard(board)}}
              >
                {/* Edit */}
                <FaEdit />
              </button>
              <Link
                to={`/boards/${board._id}`}
                key={board._id}
                onClick={() => {
                  handleSetCurrentBoard(board._id);
                }}
              >
                {board.name}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
} else {
  return (
    <div>
      <div>We are now in editing mode</div>
      <input
      type="text"
      value={editedText}
      onChange={(e) => {setEditedText(e.target.value)}}
      ></input>
      <button
      onClick={() => {
        handleSaveEdit()
      }}
      >Finish Updating</button>
    </div>
  )
}
};

export default BoardsView;