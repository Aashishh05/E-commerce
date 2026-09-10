import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Redux/authSlice.js";
import cartSlice from "../Redux/cartSlice.js";
import wishlistSlice from "../Redux/wishlistSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
  },
});
