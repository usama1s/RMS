import axios from "axios";

// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://codify.pk/ros";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // Add any common headers you need for your API calls
    "Content-Type": "application/json",
    withCredentials: true,
    // Authorization: 'Bearer <token>', // Uncomment this line if you use authorization header
  },
});

export default api;
