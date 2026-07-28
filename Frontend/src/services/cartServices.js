import axios from "axios";

export const addToCartAPI = (data) => {
  axios.post("/cart/add", data);
};

export const getCartAPI = () => {
  axios.get("/get");
};

export const updateCartAPI = (id, quantity) => {
  axios.put(`/cart/update/${id}`, { quantity });
};

export const removeCartAPI = (id) => {
  axios.delete(`/cart/remove/${id}`);
};

export const clearCartAPI = () => {
  axios.delete("/cart/clear");
};
