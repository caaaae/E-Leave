// src/publicApi.js
import axios from 'axios';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Or whatever your base URL is
});

export default publicApi;