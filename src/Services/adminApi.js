import axios from "axios";

const adminApi = axios.create({
  baseURL: 'https://backendcyberpips-production.up.railway.app/api',
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
});

// Attach admin token
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
