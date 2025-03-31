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
      console.log("update project thunk", body);
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

// this will contain our whole data set (especially concerning tasks)
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