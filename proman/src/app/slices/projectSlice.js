import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// const PORT = import.meta.env.VITE_PORT;

console.log("vite api url", `${apiUrl}`);

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (boardId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/boards/${boardId}/projects`
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const postProject = createAsyncThunk(
  "projects/postProject",
  async (data) => {
    const body = {
      name: data.projectText,
    };
    try {
      const response = await axios.post(
        `${apiUrl}/board/${data.boardId}/projects`,
        body
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/projects/${projId}`
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projId, text }) => {
    const body = {
      text,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/projects/${projId}`,
        body
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const projectTimerStart = createAsyncThunk(
  "/projects/projectTimerStart",
  async ({ projName, projId, toggleId }) => {
    const body = {
      projName,
      projId,
      toggleId,
    };
    try {
      const response = await axios.post(`${apiUrl}/start`, body);
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const projectTimerStop = createAsyncThunk(
  "/projects/projectTimerStop",
  async ({ projName, projId, timeEntryId }) => {
    const body = {
      projName,
      projId,
      timeEntryId,
    };
    try {
      const response = await axios.patch(`${apiUrl}/stop`, body);
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

const initialState = {
  projects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.projects = action.payload;
    });
  },
});

export default projectsSlice.reducer;
