import { configureStore } from "@reduxjs/toolkit"
import boardReducer from "../slices/boardSlice"
import projectReducer from "../slices/projectSlice"
import taskReducer from "../slices/taskSlice"
import authReducer from "../slices/authSlice"

const store = configureStore({
  reducer: {
    storeBoards: boardReducer,
    storeProjects: projectReducer,
    storeTasks: taskReducer,
    storeAuth: authReducer
  }
})

export default store