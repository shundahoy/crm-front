import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, AppThunk } from "../../app/store";
import {
  POST_CUSTOMER,
  POST_PRODUCT,
  REGISTER_FORM,
  UPDATE_PRODUCT,
} from "../types";

import dataProduct from "./dataProduct.json";

type DATAPRODUCT = typeof dataProduct;

interface PRODUCT_STATE {
  products: DATAPRODUCT;
}
const initialState: PRODUCT_STATE = {
  products: [],
};

export const fetchAsyncGetProducts = createAsyncThunk(
  "getProducts",
  async () => {
    const res = await axios.get<DATAPRODUCT>(
      `${process.env.REACT_APP_API_URL}/product`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const updateProduct = createAsyncThunk(
  "updateProduct",
  async (post: UPDATE_PRODUCT) => {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/product/${post.product_id}`,
      {
        name: post.name,
        memo: post.memo,
        price: post.price,
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

export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async (id: number) => {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/product/${id}`,
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

export const createProduct = createAsyncThunk(
  "createProduct",
  async (post: POST_PRODUCT) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/product`,
      {
        name: post.name,
        memo: post.memo,
        price: post.price,
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

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncGetProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchAsyncGetProducts.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products = [action.payload, ...state.products];
      })
      .addCase(createProduct.rejected, (state, action) => {
        window.location.href = "/";
      });
  },
});

export const selectProducts = (state: RootState) => state.product.products;

// export const { selectCustomer, selectCustomerInitial } = customerSlice.actions;
export default productSlice.reducer;
