import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Redux/authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

