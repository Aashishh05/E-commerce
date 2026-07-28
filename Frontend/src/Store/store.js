import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Redux/authSlice.js";
import cartSlice from "../Redux/cartSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
  },
});
