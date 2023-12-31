import { axiosInstance } from "../utils/axios";

export const assignmentServices = {
  // API get assignment list
  getAssignmentList: async (classId) => {
    try {
      const response = await axiosInstance.get(`/assignments/${classId}/all`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  getAssignmentById: async (assignmentId) => {
    try {
      const response = await axiosInstance.get(`/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  // API create new assignment for student
  createAssignment: async (assignmentData) => {
    try {
      const response = await axiosInstance.post("/assignments", assignmentData);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  uploadFile: async (fileUrl) => {
    try {
      const file = new FormData();
      file.append("file", fileUrl);
      const response = await axiosInstance.post("/files/upload", file, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
