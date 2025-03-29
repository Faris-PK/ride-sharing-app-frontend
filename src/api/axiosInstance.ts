import axios from "axios";
import { store } from "../redux/store";
import { clearUser } from "../redux/slices/authSlice"
const   API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.post("/auth/refresh");
        if (res.status === 200) {
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        await axiosInstance.post("/auth/logout");
        store.dispatch(clearUser());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;