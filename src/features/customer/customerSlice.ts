import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, AppThunk } from "../../app/store";
import { POST_CUSTOMER, REGISTER_FORM } from "../types";

import dataCustomer from "./dataCustomer.json";

type DATACUSTOMER = typeof dataCustomer;

interface CUSTOMER_STATE {
  customers: DATACUSTOMER;
  progress: [
    {
      id: number;
      name: string;
    }
  ];
}
const initialState: CUSTOMER_STATE = {
  customers: dataCustomer,
  progress: [{ id: 0, name: "" }],
};

export const fetchAsyncGetCustomer = createAsyncThunk(
  "getCustomer",
  async (page: number) => {
    const res = await axios.get<DATACUSTOMER>(
      `${process.env.REACT_APP_API_URL}/customer?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetProgress = createAsyncThunk(
  "getProgress",
  async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/progress`, {
      headers: {
        Authorization: `Bearer ${localStorage.localJWT}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);
export const updateCustomer = createAsyncThunk(
  "updateCustomer",
  async (post: POST_CUSTOMER) => {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/customer/${post.id}`,
      {
        name: post.name,
        email: post.email,
        memo: post.memo,
        tel: post.tel,
        url: post.url,
        progress_id: post.progress_id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

export const deleteCustomer = createAsyncThunk(
  "deleteCustomer",
  async (id: number) => {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/customer/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncGetCustomer.fulfilled, (state, action) => {
        state.customers = action.payload;
      })
      .addCase(fetchAsyncGetCustomer.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.customers.data = state.customers.data.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers.data = state.customers.data.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(fetchAsyncGetProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        window.location.href = "/";
      });
  },
});

export const selectCustomers = (state: RootState) => state.customer.customers;
export const selectProgress = (state: RootState) => state.customer.progress;

// export const { selectCustomer, selectCustomerInitial } = customerSlice.actions;
export default customerSlice.reducer;
