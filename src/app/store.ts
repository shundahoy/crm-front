import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customer/customerSlice";
import orderReducer from "../features/order/orderSlice";
import productReducer from "../features/product/productSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    customer: customerReducer,
    order: orderReducer,
    product: productReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
