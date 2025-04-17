import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostNewBoard, fetchBoards } from "../app/slices/boardSlice";
import { CiCirclePlus } from "react-icons/ci";
import { useForm } from "react-hook-form";

export const CreateBoard = () => {
  const form = useForm();
  const { register, reset, handleSubmit, formState } = form;
  const { errors } = formState;

  const authState = useSelector((state) => {
    return state.storeAuth;
  });

  const currentUser = authState.currentUser;
  const localUser = JSON.parse(localStorage.getItem("currentUser"));

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    event.preventDefault();
    try {
      await dispatch(
        fetchPostNewBoard({
          text: data.boardname,
          userId: currentUser._id,
          date: data.deadline,
        })
      );
      await dispatch(fetchBoards(currentUser._id));
      reset({ keepSubmitCount: true });
    } catch (err) {
      return err;
    }
  };

  return (
    <div className="row">
      <div className="col-3"></div>
      <div className="col-6">
        <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
          <h3>Create a new Board</h3>
          <div className="mb-3">
            <label htmlFor="boardname" className="form-label">
              Board Name
            </label>
            <input
              className="form-control"
              type="text"
              id="boardname"
              {...register("boardname", {
                required: {
                  value: true,
                  message: "You must create a name for your board",
                },
              })}
            ></input>
            {errors.boardname ? (
              <p className="alert alert-danger">{errors.boardname?.message}</p>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="deadline" className="form-label">
              Deadline
            </label>
            <input
              className="form-control"
              type="date"
              id="deadline"
              {...register("deadline", {
                required: false,
              })}
            ></input>
          </div>
          <button className="btn btn-primary">Create Board</button>
        </form>
      </div>
    </div>
  );
};
