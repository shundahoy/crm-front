import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, AppThunk } from "../../app/store";
import { POST_CUSTOMER, REGISTER_FORM } from "../types";

import dataProduct from "./dataProduct.json";

type DATAPRODUCT = typeof dataProduct;

interface PRODUCT_STATE {
  products: DATAPRODUCT;
}
const initialState: PRODUCT_STATE = {
  products: dataProduct,
};

export const fetchAsyncGetProducts = createAsyncThunk(
  "getProducts",
  async () => {
    const res = await axios.get<DATAPRODUCT>(
      `${process.env.REACT_APP_API_URL}/product`,
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
      });
  },
});

export const selectProducts = (state: RootState) => state.product.products;

// export const { selectCustomer, selectCustomerInitial } = customerSlice.actions;
export default productSlice.reducer;
