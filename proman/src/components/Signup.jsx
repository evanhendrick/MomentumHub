import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitSignin } from "../app/slices/authSlice";
import { Link } from "react-router-dom";
import _ from "lodash";
import { authActions } from "../app/slices/authSlice";

export default function Signup() {
  const form = useForm();
  const { register, handleSubmit, formState, clearErrors } = form;
  const { errors } = formState;

  const authState = useSelector((state) => {
    return state.storeAuth;
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // event.preventDefault();
    try {
      const res = await dispatch(submitSignin(data));
      if (res.type === "auth/submitSignin/fulfilled") {
        console.log("Signin fulfilled!");
        localStorage.getItem("token");
        navigate("/user");
      } else {
        console.log("res.type !== fulfilled");
      }
    } catch (err) {
      console.log("res.type !== fulfilled");
      return err;
    }
  };

  const handleClearErrors = () => {
    if (authState.error) {
      clearErrors("username");
      clearErrors("password");
      dispatch(authActions.resetError());
    }
  };

  return (
    <div className="container">
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
            <h5>Login:</h5>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
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
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
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
                onChange={(e) => {
                  register("password").onChange(e);
                  handleClearErrors();
                }}
              ></input>
              {errors.password ? (
                <p className="alert alert-danger">{errors.password?.message}</p>
              ) : null}
              {authState.error ? (
                <p className="alert alert-danger">{authState.error}</p>
              ) : null}
            </div>

            <button className="btn btn-success">Submit</button>

            <h3 className="mt-3">or:</h3>

            <div className="mb-3 mt-3 alert alert-info">
              <Link to="/signup">Create a new Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
