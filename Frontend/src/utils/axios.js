import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      toast.error(error.response.data.message);
      error._isHandled = true; // mark it
    }
    return Promise.reject(error);
  },
);
export default API;
