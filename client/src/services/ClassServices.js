import { axiosInstance } from "../utils/axios";

export const classServices = {
  createClass: async (classInfo) => {
    try {
      const response = await axiosInstance.post("/classes", classInfo);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
