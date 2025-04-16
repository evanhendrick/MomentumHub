import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (boardId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/boards/${boardId}/projects`
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
        `http://localhost:8000/board/${data.boardId}/projects`,
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
        `http://localhost:8000/projects/${projId}`
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
        `http://localhost:8000/projects/${projId}`,
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
      const response = await axios.post("http://localhost:8000/start", body);
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
      const response = await axios.patch("http://localhost:8000/stop", body);
      return response.data
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
