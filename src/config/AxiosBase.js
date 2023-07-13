import axios from "axios";

// export const url = "http://localhost:5000";
export const url = "https://rms-backend-production.up.railway.app/";

const BASE_URL = url;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // Add any common headers you need for your API calls
    // "Content-Type": "application/json",
    withCredentials: true,
    // Authorization: 'Bearer <token>', // Uncomment this line if you use authorization header
  },
});

export default api;
