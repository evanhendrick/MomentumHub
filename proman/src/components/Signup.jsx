import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import { useDispatch, useSelector } from "react-redux";
import { submitSignup } from "../app/slices/authSlice"
import { protectedFetch } from "../app/slices/authSlice";

export default function Signup () {
  const authState = useSelector((state) => {
    return state.storeAuth
  })

  console.log("auth state, retrieved by redux from localStorage", authState)
  const token = authState.isAuthenticated

  const form = useForm()
  const {register, control, handleSubmit, formState } = form
  const { errors } = formState

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    event.preventDefault();
    try {
      dispatch(submitSignup(data)).then(() => {
        if(authState.isAuthenticated){
          navigate('/user')
        }
        // else if(authState.error) {
        //   console.log(authState.error)
        //   // doesn't really work. Will have to figure something else out for this
        //   return (
        //     <div>
        //       <p>{authState.error}</p>
        //     </div>
        // )
        // }
      })
    } catch (err) {
      console.log("try/catch error>> ", err)
      return err
    }
  }

  // pass in token
  const submitToken = () => {
    dispatch(protectedFetch(token))
  }

  const removeToken = () => {
    localStorage.removeItem('token')
  }

  return (
    <div>
      <button
      onClick={() => {submitToken()}}
      >Send token</button>
      <button
      onClick={() => {removeToken()}}
      >remove Token</button>
      {authState.error ? <div className="errors">{authState.error}</div> : null}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="username">username</label>
        <input
        type="text"
        id="username"
        {...register("username", {
            required: {
              value: true,
              message: "Must enter a username"
            },
            validate: {
              notAdmin: (fieldValue) => {
                return fieldValue !== "admin" || "You cannot have this username"
              }
            }
          })
        }
        ></input>
        <p className="errors">{errors.username?.message}</p>

        <label htmlFor="password">Password</label>
        <input
        // add onClick to show the password...?
        type="password"
        id="password"
        // how to make password minimum 16 characters, w/1 caps letter and 1 #, and 1 special character (!@#$%^&*)
        {...register('password', {
            required: {
              value: true,
              message: "Must enter a password"
            }
          }
        )}
        ></input>
        <p className="errors">{errors.password?.message}</p>

        <button>Submit</button>
        {/* <DevTool control={control}/> */}
      </form>
    </div>
  )
}