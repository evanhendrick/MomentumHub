import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { submitSignup } from "../app/slices/authSlice";
import { Link } from "react-router-dom";
import { authActions } from "../app/slices/authSlice";

export const NewUser = () => {
  const form = useForm();
  const { register, handleSubmit, formState, clearErrors } = form;
  const { errors } = formState;

  const navigate = useNavigate();

  const authState = useSelector((state) => {
    return state.storeAuth;
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    event.preventDefault();
    try {
      const response = await dispatch(submitSignup(data));
      if (response.type === "auth/submitSignup/fulfilled") {
        alert("New user sucessfully created. Please sign in");
        navigate("/");
      }
    } catch (err) {
      return err;
    }
  };

  const handleClearErrors = () => {
    if (authState.error) {
      clearErrors("username");
      dispatch(authActions.resetError());
    } else {
      console.log("no errors to reset");
    }
    // authState.error = null;
  };

  return (
    <div className="container">
      <Link to="/">Home</Link>
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <h3>Welcome to Momentum Hub!</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <form
            className="form-control"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <h5>Create your account:</h5>
            <div className="mb-3">
              <label for="username" className="form-label">
                Create a Username
              </label>
              <input
                className="form-control"
                type="text"
                id="username"
                {...register("username", {
                  required: {
                    value: true,
                    message: "Must enter a username",
                  },
                  validate: {
                    notAdmin: (fieldValue) => {
                      return (
                        fieldValue !== "admin" ||
                        "You cannot have this username"
                      );
                    },
                  },
                })}
                onChange={(e) => {
                  register("username").onChange(e);
                  handleClearErrors();
                }}
              ></input>
              {errors.username ? (
                <p className="alert alert-danger">{errors.username?.message}</p>
              ) : null}
              {authState.error ? (
                <p className="alert alert-danger">{authState.error}</p>
              ) : null}
            </div>

            <div className="mb-3">
              <label for="password" className="form-label">
                Password
              </label>
              <input
                className="form-control"
                type="password"
                id="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Must enter a password",
                  },
                })}
              ></input>
              {errors.password ? (
                <p className="alert alert-danger">{errors.password?.message}</p>
              ) : null}
            </div>

            <button className="btn btn-success">Submit</button>

            <div className="mb-3" style={{ marginTop: "50px" }}></div>
          </form>
        </div>
      </div>
    </div>
  );
};
