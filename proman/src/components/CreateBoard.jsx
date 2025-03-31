import React from "react";
import { useState } from "react";
import { useDispatch, } from "react-redux";
import { fetchPostNewBoard, fetchBoards } from "../app/slices/boardSlice";
import { CiCirclePlus } from "react-icons/ci";

export const CreateBoard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [boardName, setBoardName] = useState("");

  const dispatch = useDispatch();

  const handleSetIsVisible = async () => {
    if (isVisible === true) {
      await postBoard();
      setIsVisible(false);
      setBoardName("");
    } else {
      setIsVisible(true);
    }
    await dispatch(fetchBoards());
  };
  console.log("visible", isVisible);
  const postBoard = async () => {
    await dispatch(fetchPostNewBoard(boardName));
  };

  if (isVisible === true) {
    return (
      <div>
        <input
          type="text"
          placeholder="Board Name"
          onChange={(e) => {
            setBoardName(e.target.value);
          }}
        ></input>
        <button
          className="btn btn-primary"
          onClick={() => {
            handleSetIsVisible();
          }}
          onKeyDown={handleSetIsVisible}
        >
          Create
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <div>Create a new board</div>
        <button
          className="btn btn-primary"
          onClick={() => {
            handleSetIsVisible();
          }}
        >
          Add Board
        </button>
      </div>
    );
  }
};
