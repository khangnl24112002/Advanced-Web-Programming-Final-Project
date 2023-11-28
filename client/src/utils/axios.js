import axios from "axios";
const getToken = () => JSON.parse(localStorage.getItem("token"));

export const baseURL = "http://localhost:3333/";
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
