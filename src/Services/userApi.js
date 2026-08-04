import axios from "axios";

const userApi = axios.create({
  baseURL: 'https://backendcyberpips-production.up.railway.app/api',
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach user token
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default userApi;
