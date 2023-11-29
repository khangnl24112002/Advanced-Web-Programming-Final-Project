import { axiosInstance } from "../utils/axios";

export const userServices = {
    update: async (email, userInfo, token) => {
        try {
            const response = await axiosInstance.put(
                `/user?email=${email}`,
                userInfo,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    },
    getAll: async (token) => {
        try {
            const response = await axiosInstance.get("/user", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    },
};
