import { createSlice } from "@reduxjs/toolkit";

const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? `cart_${user._id}` : "cart_guest";
};

const loadCartFromStorage = () => {
  try {
    const key = getCartKey();

    const savedCart = localStorage.getItem(key);

    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  const key = getCartKey();

  localStorage.setItem(key, JSON.stringify(items));
};

const initialState = {
  items: loadCartFromStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      saveCartToStorage(state.items);
    },

    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.product === action.payload.product,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      const item = state.items.find((item) => item.product === productId);

      if (item) {
        item.quantity = quantity;
      }

      saveCartToStorage(state.items);
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product !== action.payload,
      );

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];

      saveCartToStorage(state.items);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

export const selectCartItemCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
