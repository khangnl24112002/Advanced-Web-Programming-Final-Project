import axios from "axios";
const getToken = () => JSON.parse(localStorage.getItem("token"));

export const baseURL = "https://final.clinus.live";
// export const baseURL = "https://e5ea-42-116-127-108.ngrok-free.app";
export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${getToken()}`,
    post: {
      "Content-Type": "application/json",
    },
    put: {
      "Content-Type": "application/json",
    },
  },
});

axios.interceptors.request.use(
  (request) => {
    console.log(request);
    // Edit request config
    return request;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(response);
    // Edit response config
    return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
