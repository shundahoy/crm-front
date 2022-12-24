import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, AppThunk } from "../../app/store";
import {
  CART,
  CREATE_ORDER,
  POST_CART,
  POST_CUSTOMER,
  PRODUCT,
  REGISTER_FORM,
  UPDATE_ORDER,
} from "../types";

import dataOrder from "./dataOrder.json";

type DATAORDER = typeof dataOrder;

interface ORDER_STATE {
  orders: DATAORDER;
  statuses: [
    {
      id: number;
      name: string;
    }
  ];
  cart: POST_CART[];
}
const initialState: ORDER_STATE = {
  orders: dataOrder,
  statuses: [{ id: 0, name: "" }],
  cart: [],
};

export const fetchAsyncGetOrders = createAsyncThunk(
  "getOrders",
  async (page: number) => {
    const res = await axios.get<DATAORDER>(
      `${process.env.REACT_APP_API_URL}/order?page=${page}`,
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

export const fetchAsyncGetStatus = createAsyncThunk("getStatus", async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/status`, {
    headers: {
      Authorization: `Bearer ${localStorage.localJWT}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
});

export const updateOrder = createAsyncThunk(
  "updateOrder",
  async (post: UPDATE_ORDER) => {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/order/${post.order_id}`,
      {
        status_id: post.status_id,
        customer_id: post.customer_id,
        products: post.products,
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

export const createOrder = createAsyncThunk(
  "createOrder",
  async (post: CREATE_ORDER) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/order/`,
      {
        status_id: post.status_id,
        customer_id: post.customer_id,
        products: post.products,
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
export const deleteOrder = createAsyncThunk(
  "deleteOrder",
  async (id: number) => {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/order/${id}`,
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
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCartItem: (state, action) => {
      state.cart = [];

      action.payload.allProducts.map((product: CART) => {
        let isItem: PRODUCT[] = action.payload.cartProducts.filter(
          (cartItem: PRODUCT) => product.id === cartItem.id
        );

        if (isItem[0]) {
          let newItem: POST_CART = {
            id: isItem[0].id,
            name: isItem[0].name,
            memo: isItem[0].memo,
            quantity: isItem[0].pivot.quantity,
            price: isItem[0].price,
          };
          state.cart = [...state.cart, { ...newItem }];
        } else {
          let newItem: POST_CART = {
            id: product.id,
            name: product.name,
            memo: product.memo,
            quantity: 0,
            price: product.price,
          };
          state.cart = [...state.cart, { ...newItem }];
        }
      });
    },
    changeCartItem: (state, action) => {
      let changeItem: any = state.cart.find((v) => v.id === action.payload.id);
      changeItem = {
        ...changeItem,
        [action.payload.inputName]: action.payload.data,
      };
      state.cart = state.cart.map((item) => {
        if (item.id === changeItem.id) {
          return changeItem;
        } else {
          return item;
        }
      });
    },
    resetCartItem: (state) => {
      state.cart = [];
    },
    initialCart: (state, action) => {
      state.cart = [];
      action.payload.allProducts.map((product: CART) => {
        let newItem: POST_CART = {
          id: product.id,
          name: product.name,
          memo: product.memo,
          quantity: 0,
          price: product.price,
        };
        state.cart = [...state.cart, { ...newItem }];
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncGetOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchAsyncGetOrders.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(fetchAsyncGetStatus.fulfilled, (state, action) => {
        state.statuses = action.payload;
      })
      .addCase(fetchAsyncGetStatus.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.orders.data = state.orders.data.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders.data = state.orders.data.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        window.location.href = "/";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.data = [action.payload, ...state.orders.data];
      })
      .addCase(createOrder.rejected, (state, action) => {
        window.location.href = "/";
      });
  },
});

export const selectOrders = (state: RootState) => state.order.orders;
export const selectStatuses = (state: RootState) => state.order.statuses;
export const selectCart = (state: RootState) => state.order.cart;

export const { setCartItem, changeCartItem, resetCartItem, initialCart } =
  orderSlice.actions;
export default orderSlice.reducer;
