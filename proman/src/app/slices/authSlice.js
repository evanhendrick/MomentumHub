import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const submitSignup = createAsyncThunk(
  "auth/submitSignup", 
  async(body, {rejectWithValue}) => {
  try {
    await console.log("submit signup received",body)
    const response = await axios.post("http://localhost:8000/signin", body)
    await console.log("signin async thunk", response.data)
    // localStorage.setItem('token', response.data.token)
    return response.data
  } catch(err) {
    return rejectWithValue(err)
  }
//  return body
})

export const protectedFetch = createAsyncThunk("auth/protectedFetch", async (token) => {
try {
  await console.log("request sent")   
  const response = await axios.get("http://localhost:8000/protected", 
    {
      headers: {
        Authorization: `Bearer ${token}`
        // "Bearer" + token
      }
  }
)
  return response.data
} catch(err) {
  return err
}
})

const initialState = {
  isAuthenticated: localStorage.getItem('token') || '',
  error: '',
  data: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(submitSignup.fulfilled, (state, action) => {
      //>> want to know if wwe should assign localStorage the token that we received from API?
      // state.isAuthenticated = localStorage.getItem("token") || ""
      console.log("successful retrieval", action.payload)
      state.isAuthenticated = action.payload
      state.error = ''
    })
    .addCase(submitSignup.rejected, (state, action) => {
      // console.log("retrieval failure", action.payload.response.data.error)
      const resErr = action.payload.response.data.error
      state.isAuthenticated = false
      state.error = resErr
    })
    .addCase(protectedFetch.fulfilled, (state, action) => {
      state.data = action.payload
      // need to remove lcoalstorage item
    })
  }
})

export default authSlice.reducer;