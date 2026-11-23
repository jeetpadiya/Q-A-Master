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

// Auth APIs
export const registerUser = (payload) => api.post("/api/users/register", payload);
export const loginUser = (payload) => api.post("/api/users/login", payload);

// Static Quiz & Certificate APIs
export const getQuestionsApi = (category) =>
  api.get("/api/questions", { params: category ? { category } : {} });

export const submitQuizApi = (payload) =>
  api.post("/api/quiz/submit", payload);

export const getMyCertificatesApi = () =>
  api.get("/api/certificates/my-certificates");

export const verifyCertificateApi = (code) =>
  api.get(`/api/certificates/verify/${code}`);

// AI RAG Adaptive Quiz APIs
export const startAdaptiveSessionApi = (payload) =>
  api.post("/api/adaptive/start", payload);

export const submitAdaptiveAnswerApi = (payload) =>
  api.post("/api/adaptive/submit", payload);

export const getAdaptiveHistoryApi = () =>
  api.get("/api/adaptive/history");

// Spot The Bug Mode APIs
export const getSpotTheBugTracksApi = () =>
  api.get("/api/spot-the-bug/tracks");

export const getSpotTheBugChallengeApi = (params) =>
  api.get("/api/spot-the-bug/challenge", { params });

export const verifySpotTheBugAnswerApi = (payload) =>
  api.post("/api/spot-the-bug/verify", payload);

// Senior Architect Consultation API
export const askSeniorArchitectApi = (payload) =>
  api.post("/api/senior-architect/explain", payload);

export default api;
