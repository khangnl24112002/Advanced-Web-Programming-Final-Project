import { axiosInstance } from "../utils/axios";

export const authServices = {
  login: async (userAccount) => {
    try {
      const response = await axiosInstance.post("/auth/login", userAccount);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  signup: async (userAccount) => {
    try {
      const response = await axiosInstance.post("/auth/register", userAccount);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  },
  handleOAuthLogin: async (provider) => {
    console.log(provider);
    try {
      if (provider === "Google") {
        window.open(
          "https://e8bd-115-74-164-116.ngrok-free.app/auth/google",
          "_self"
        );
      } else if (provider === "Facebook") {
        window.open(
          "https://e8bd-115-74-164-116.ngrok-free.app/auth/facebook",
          "_self"
        );
      }
    } catch (error) {}
  },
};
