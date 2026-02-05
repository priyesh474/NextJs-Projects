import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3001",
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;
