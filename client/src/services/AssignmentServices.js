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
  getAssignmentReviews: async (assignmentId) => {
    try {
      const response = await axiosInstance.get(
        `/assignments/${assignmentId}/requested-grade-view`
      );
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
  updateAssignment: async (assignmentData, assignmentId) => {
    try {
      const response = await axiosInstance.put(
        `/assignments/${assignmentId}`,
        assignmentData
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  deleteAssignment: async (assignmentId) => {
    try {
      const response = await axiosInstance.delete(
        `/assignments/${assignmentId}`
      );
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
  markScoreForStudent: async (assignmentId, data) => {
    try {
      const response = await axiosInstance.post(
        `/assignments/${assignmentId}/mark-score`,
        data
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  getMessageList: async (studentRequestedReviewId) => {
    try {
      const response = await axiosInstance.get(
        `/assignments/requested-grade-view/${studentRequestedReviewId}/conversation`
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  sendMessage: async (assignmentId, studentRequestedReviewId, message) => {
    try {
      const response = await axiosInstance.post(
        `/assignments/${assignmentId}/requested-grade-view/${studentRequestedReviewId}/conversation`,
        {
          message: message,
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  updateReviewScoreResult: async (studentRequestedReviewId, data) => {
    try {
      const response = await axiosInstance.put(
        `/assignments/requested-grade-view/${studentRequestedReviewId}`,
        data
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
