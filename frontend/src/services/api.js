// frontend/src/services/api.js
import axios from 'axios';

// Create an instance of axios pointing to our backend URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Interceptor: This runs BEFORE every request sent to the backend
API.interceptors.request.use((req) => {
  // Check if we have a token saved in the browser's Local Storage
  const token = localStorage.getItem('token');
  
  if (token) {
    // If we do, attach it to the headers (just like our backend middleware expects!)
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;