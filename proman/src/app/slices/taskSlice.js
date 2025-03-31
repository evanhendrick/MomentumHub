import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchTasks = createAsyncThunk("task/fetchTasks", async (projectId) => {
  try{
    const response = await axios.get(`http://localhost:8000/projects/${projectId}/tasks`)
    return response.data
  } catch (err) {
    return err
  }
})

export const postTask = createAsyncThunk("task/postTask", async ({projId, taskName}) => {
  const body = {
    name: taskName,
    completed: false,
    project: projId
  }
  try {
    const response = await axios.post(`http://localhost:8000/projects/${projId}/tasks`, body)
    return response.data
  } catch (err) {
    return err
  }
})

export const deleteTask = createAsyncThunk("task/deleteTask", async (taskId) => {
  try {
    const response = await axios.delete(`http://localhost:8000/tasks/${taskId}`)
    return response.data
  } catch (err) {
    return err
  }
})

export const updateTask = createAsyncThunk("task/updateTask", async ({taskId, text}) => {
  const body = {
    taskId,
    text
  };
  console.log("line41 asyncthunk", body)
  try {
    const response = axios.put(`http://localhost:8000/tasks/${taskId}`, body)
    return response.data
  } catch (err) {
    return err
  }
})

const initialState = {
  tasks: [],
  currentTask: {}
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload
    })
  }
})

export default taskSlice.reducer