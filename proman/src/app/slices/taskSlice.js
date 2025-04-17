import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_PORT;

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (projectId) => {
    try {
      const response = await axios.get(
        `${apiUrl}${PORT}/projects/${projectId}/tasks`
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const postTask = createAsyncThunk(
  "task/postTask",
  async ({ projId, taskName }) => {
    const body = {
      name: taskName,
      completed: false,
      project: projId,
    };
    try {
      const response = await axios.post(
        `${apiUrl}${PORT}/projects/${projId}/tasks`,
        body
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId) => {
    try {
      const response = await axios.delete(`${apiUrl}${PORT}/tasks/${taskId}`);
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ taskId, text }) => {
    const body = {
      taskId,
      text,
    };
    try {
      const response = axios.put(`${apiUrl}${PORT}/tasks/${taskId}`, body);
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: {},
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export default taskSlice.reducer;
