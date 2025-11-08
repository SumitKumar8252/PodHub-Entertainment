import axios from "axios";

// Ensure base URL exists
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  console.error("VITE_API_BASE_URL is NOT defined in .env");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("podhub_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Intercept all responses & handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong";

    if (error.response) {
      // Backend responded with error
      message = error.response.data?.message || error.response.statusText;
    } else if (error.request) {
      // Request made but no response (backend down)
      message = "Cannot reach server. Check backend connection.";
    } else {
      // Something else
      message = error.message;
    }

    // OPTIONAL: Auto-logout on token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("podhub_token");
      localStorage.removeItem("podhub_user");
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
