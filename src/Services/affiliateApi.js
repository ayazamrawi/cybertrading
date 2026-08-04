import axios from "axios";

const affiliateApi = axios.create({
  baseURL: 'https://backendcyberpips-production.up.railway.app/api',
  headers: {
    Accept: "application/json",
  },
});

affiliateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("affiliateToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default affiliateApi;
