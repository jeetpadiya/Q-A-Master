import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:3000" : "");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (payload) => api.post("/api/users/register", payload);
export const loginUser = (payload) => api.post("/api/users/login", payload);

export default api;
