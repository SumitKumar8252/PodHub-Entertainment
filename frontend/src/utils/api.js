import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("podhub_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// basic error handling passthrough
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message;
    return Promise.reject(new Error(msg));
  }
);

export default api;
