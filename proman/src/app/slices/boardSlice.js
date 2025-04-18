import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// const PORT = import.meta.env.VITE_PORT;

export const fetchBoards = createAsyncThunk(
  "board/fetchBoards",
  async (userId) => {
    let token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${apiUrl}/boards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const fetchBoard = createAsyncThunk(
  "board/fetchBoard",
  async (boardId) => {
    try {
      const response = await axios.get(`${apiUrl}/boards/${boardId}`);
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const fetchPostNewBoard = createAsyncThunk(
  "board/fetchPostNewBoard",
  async ({ text, userId, date }) => {
    try {
      const data = {
        name: text,
        userId,
        date: date,
      };
      const response = await axios.post(`${apiUrl}/save-data`, data);
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const updateBoard = createAsyncThunk(
  "board/updateBoard",
  async (boardId, text) => {
    const body = {
      board: boardId,
      text: text,
    };
    try {
      const response = await axios.put(
        `${apiUrl}/board/${boardId}`,
        body
      );
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

export const deleteBoard = createAsyncThunk(
  "board/deleteBoard",
  async (boardId) => {
    try {
      const response = await axios.delete(`${apiUrl}/boards/${boardId}`);
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

const initialState = {
  boards: [],
  currBoard: {},
  projects: [],
  currProject: {},
  tasks: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.currBoard = action.payload[0];
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.boards = action.payload;
      });
  },
});

export default boardSlice.reducer;
