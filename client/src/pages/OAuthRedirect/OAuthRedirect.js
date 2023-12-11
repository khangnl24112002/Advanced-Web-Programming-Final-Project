import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import RedirectModal from "./RedirectModal/index";
import Dropdown from "../../components/Dropdown";
import { getRoleIdFromRole } from "../../utils/Role";
import styles from "./RedirectModal/RedirectModal.module.sass";
import { userServices } from "../../services/UserServices";
import cn from "classnames";

const OAUthRedirect = () => {
  const { login } = useAuth();
  const [visibleModal, setVisibleModal] = useState(false);
  const roleList = ["Học sinh", "Giáo viên"];
  const [role, setRole] = useState(roleList[0]);
  const [searchParams] = useSearchParams();
  const userInfo = {
    id: searchParams.get("id"),
    firstName: searchParams.get("firstName"),
    lastName: searchParams.get("lastName"),
    email: searchParams.get("email"),
    picture: searchParams.get("picture"),
    role: searchParams.get("role"),
  };
  const token = searchParams.get("token");
  console.log(userInfo);
  useEffect(() => {
    // Get user info from URL
    if (userInfo.picture === "undefined") {
      userInfo.picture = undefined;
    }
    // Nếu không có role: render màn hình yêu cầu nhập role
    if (userInfo.role === "user") {
      setVisibleModal(true);
    }
    // login(userInfo, searchParams.get("accessToken"));
  }, []);

  const handleUpdateRole = async () => {
    let userRole;
    // role=1: admin
    // role=2: user
    // role=3: student
    // role=4: teacher
    if (role === "student") {
      userRole = getRoleIdFromRole("student");
    } else if (role === "teacher") {
      userRole = getRoleIdFromRole("teacher");
    } // Gọi service để lấy role ở đây
    const response = await userServices.updateRole(
      userInfo.email,
      userInfo.firstName,
      userInfo.lastName,
      userRole,
      token
    );
    // Nếu thành công: update lên localStorage, cho vào trang đăng nhập
    if (response.status) {
      const updatedResponse = {
        user: {
          id: userInfo.id,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          role: userRole,
        },
        token: token,
      };
      login(updatedResponse.user, updatedResponse.token);
    }
    return (
      <div>
        <LoadingSpinner />
        <RedirectModal
          outerClassName={styles.outer}
          visible={visibleModal}
          onClose={() => setVisibleModal(false)}
        >
          <div>Chọn vai trò</div>
          <Dropdown
            className={styles.dropdown}
            classDropdownHead={styles.dropdownHead}
            value={role}
            setValue={setRole}
            options={roleList}
            small
          />
          <button
            style={{ marginTop: "10px" }}
            className={cn("button-small", styles.button)}
            onClick={handleUpdateRole}
          >
            Chọn
          </button>
        </RedirectModal>
      </div>
    );
  };
};

export default OAUthRedirect;
