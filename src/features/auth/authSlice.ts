import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, AppThunk } from "../../app/store";
import { JWT, LOGIN_FORM, LOGIN_USER } from "../types";

const initialState: LOGIN_USER = {
  id: 0,
  name: "",
  email: "",
};

export const fetchAsyncLogin = createAsyncThunk(
  "auth/login",
  async (auth: LOGIN_FORM) => {
    const res = await axios.post<JWT>(
      `${process.env.REACT_APP_API_URL}/login`,
      auth,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk(
  "auth/loginuser",
  async () => {
    const res = await axios.get<LOGIN_USER>(
      `${process.env.REACT_APP_API_URL}/user`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncLogin.fulfilled, (state, action) => {
        localStorage.setItem("localJWT", action.payload.jwt);
        action.payload.jwt && (window.location.href = "/app");
      })
      .addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
      });
  },
});

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const selectLoginUser = (state: RootState) => state.auth;

export default authSlice.reducer;
