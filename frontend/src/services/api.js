import axios from "axios";
import Cookies from "js-cookie";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:3000" : "");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject Authorization header from cookies
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (payload) => api.post("/api/users/register", payload);
export const loginUser = (payload) => api.post("/api/users/login", payload);

// Quiz & Certificate APIs
export const getQuestionsApi = (category) =>
  api.get("/api/questions", { params: category ? { category } : {} });

export const submitQuizApi = (payload) =>
  api.post("/api/quiz/submit", payload);

export const getMyCertificatesApi = () =>
  api.get("/api/certificates/my-certificates");

export const verifyCertificateApi = (code) =>
  api.get(`/api/certificates/verify/${code}`);

export default api;
