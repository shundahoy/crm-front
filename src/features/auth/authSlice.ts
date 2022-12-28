import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, AppThunk } from "../../app/store";
import { JWT, LOGIN_FORM, LOGIN_USER, REGISTER_FORM } from "../types";

const initialState: LOGIN_USER = {
  id: 0,
  name: "",
  email: "",
  isloading: false,
};

export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: REGISTER_FORM) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/register`,
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
    console.log(auth);
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
          Authorization: `Bearer ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.localJWT}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isloading = true;
    },
    endLoading: (state) => {
      state.isloading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncLogin.fulfilled, (state, action) => {
        localStorage.setItem("localJWT", action.payload.jwt);
        action.payload.jwt && (window.location.href = "/customer");
      })
      .addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(fetchAsyncGetMyProf.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("localJWT");
        window.location.href = "/";
      })
      .addCase(logout.rejected, (state, action) => {
        window.location.href = "/";
      });
  },
});

export const { startLoading, endLoading } = authSlice.actions;

export const selectLoginUser = (state: RootState) => state.auth;
export const selectIsLoading = (state: RootState) => state.auth.isloading;

export default authSlice.reducer;
