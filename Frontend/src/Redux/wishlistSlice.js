import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem("wishlistIds");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (ids) => {
  localStorage.setItem("wishlistIds", JSON.stringify(ids));
};

const initialState = {
  ids: loadWishlistFromStorage(),
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistIds: (state, action) => {
      state.ids = action.payload;
      saveWishlistToStorage(state.ids);
    },
    setWishlistItems: (state, action) => {
      state.items = action.payload;
      state.ids = action.payload.map((p) => p._id);
      saveWishlistToStorage(state.ids);
    },
    toggleWishlistId: (state, action) => {
      const id = action.payload;
      const index = state.ids.indexOf(id);
      if (index > -1) {
        state.ids.splice(index, 1);
      } else {
        state.ids.push(id);
      }
      saveWishlistToStorage(state.ids);
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.ids = state.ids.filter((wid) => wid !== id);
      state.items = state.items.filter((item) => item._id !== id);
      saveWishlistToStorage(state.ids);
    },
    clearWishlist: (state) => {
      state.ids = [];
      state.items = [];
      saveWishlistToStorage([]);
    },
    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
    setWishlistError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWishlistIds,
  setWishlistItems,
  toggleWishlistId,
  removeFromWishlist,
  clearWishlist,
  setWishlistLoading,
  setWishlistError,
} = wishlistSlice.actions;

export const selectWishlistIds = (state) => state.wishlist.ids;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.ids.length;

export default wishlistSlice.reducer;
