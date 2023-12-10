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
  getTeacherClass: async (token) => {
    try {
      const response = await axiosInstance.get("/classes/teacher", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  // API lấy danh sách lớp học học sinh tham gia
  getStudentClass: async (token) => {
    try {
      const response = await axiosInstance.get("/classes/student", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  // API lấy mã mời của lớp
  getInviteLinkClass: async (classId) => {
    try {
      const response = await axiosInstance.get(
        `/classes/${classId}/group-invite`
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  // API chấp nhận lời mời
  acceptGroupInvite: async (invitationId, userId) => {
    try {
      const response = await axiosInstance.get(
        `/classes/accept-group-invite/${invitationId}/${userId}`
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  acceptEmailInvite: async (token) => {
    try {
      const response = await axiosInstance.get(
        `/classes/accept-invite/${token}`
      );
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
