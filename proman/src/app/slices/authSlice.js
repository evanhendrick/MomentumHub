import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitSignin = createAsyncThunk(
  "auth/submitSignin",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:8000/signin", body);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      console.log("submit signin failed>", response.data)
      return response.data;
    } catch (err) {
      console.log("Sign-in error:", err.response.data.error);

      if (axios.isAxiosError(err) && err.response) {
        console.log("Axios err:", err.response.data.error)
        return rejectWithValue(err.response.data.error || "Sign-in failed");
      }

      return rejectWithValue("Something went wrong");
    }
  }
);

export const submitSignup = createAsyncThunk(
  "auth/submitSignup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:8000/signup", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const protectedFetch = createAsyncThunk(
  "auth/protectedFetch",
  async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  }
);

const initialState = {
  currentUser: {},
  isAuthenticated: "Client is not authenticated",
  error: "",
  data: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSignin.fulfilled, (state, action) => {
        const user = action.payload.user;
        console.log(".addCase", user);

        state.isAuthenticated = "Authenticated";
        state.error = null;
        state.currentUser = action.payload.user;
      })
      .addCase(submitSignin.rejected, (state, action) => {
        // const resErr = action.payload.response.data.error;
        // const resErr = action.payload
        console.log("submitSignin.rejected", action)
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(protectedFetch.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(submitSignup.fulfilled, (state, action) => {
        state.error = action.payload.message;
      })
      .addCase(submitSignup.rejected, (state, action) => {
        state.error = action.payload.response.data.message;
      });
  },
});

export default authSlice.reducer;
// module.exports.authActions = authSlice.actions
export const authActions = authSlice.actions