import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 60000, // Increase timeout to 60 seconds for file uploads
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  console.log("Request being sent:", {
    url: config.url,
    method: config.method,
    headers: config.headers
  });
  
  // Get token from localStorage
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error("Request error:", error);
  return Promise.reject(error);
});

// Response interceptor
axiosInstance.interceptors.response.use((response) => {
  console.log("Response received:", {
    status: response.status,
    data: response.data
  });
  return response;
}, (error) => {
  console.error("Response error:", error.response || error);
  return Promise.reject(error);
});

// Add specific config for file uploads
export const fileUploadConfig = {
  timeout: 300000, // 5 minutes
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log('Upload Progress:', percentCompleted);
  }
};

export default axiosInstance;
