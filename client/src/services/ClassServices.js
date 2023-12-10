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
  // API lấy danh sách lớp học giáo viên tham gia
  getTeacherClass: async () => {
    try {
      const response = await axiosInstance.get("/classes/teacher");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  // API lấy danh sách lớp học học sinh tham gia
  getStudentClass: async () => {
    try {
      const response = await axiosInstance.get("/classes/student");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  checkEmailExist: async (id, email) => {
    try {
      const response = await axiosInstance.get(
        `/classes/${id}/invite/${email}`
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
