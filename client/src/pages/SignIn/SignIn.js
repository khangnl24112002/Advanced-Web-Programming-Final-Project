import React, { useState } from "react";
import cn from "classnames";
import styles from "./SignIn.module.sass";
import { use100vh } from "react-div-100vh";
import { Link } from "react-router-dom";
import TextInput from "../../components/TextInput";
import { useAuth } from "../../hooks/useAuth";
import { EMAIL_REGEX } from "../../constants";
import { authServices } from "../../services/AuthServices";
import { errorToast } from "../../utils/toast";
import SignInModal from "./SignInModal/index";
import Dropdown from "../../components/Dropdown";

const SignIn = () => {
  const initalState = {
    email: "",
    password: "",
  };
  const [userAccount, setUserAccount] = useState(initalState);
  const [Response, setResponse] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const { login } = useAuth();
  const roleList = ["Học sinh", "Giáo viên"];
  const [role, setRole] = useState(roleList[0]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValidData = validateData(userAccount);
    if (isValidData === 1) {
      const response = await authServices.login(userAccount);
      if (response.status === true) {
        setResponse(response.data);
        // Kiểm tra xem đã chọn role chưa
        if (response.data.user.role !== undefined) {
          login(response.data.user, response.data.token);
        } else {
          setVisibleModal(true);
        }
      } else {
        return errorToast(response.message);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserAccount((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateRole = () => {
    let roleId;
    if (role === "Học sinh") {
      roleId = 1;
    } else if (role === "Giáo viên") {
      roleId = 2;
    }
    // Gọi service để lấy role ở đây
    const response = {
      roleId: 1,
    };
    // Cập nhật dữ liệu và đưa lên redux
    setResponse({
      ...Response,
      user: { ...Response.user, roleId: response.roleId },
    });
    login(Response.user, Response.token);
  };
  const validateData = (userAccount) => {
    let result = 1;
    if (userAccount.email === "") {
      return errorToast("Email không được để trống");
    }
    if (EMAIL_REGEX.test(userAccount.email) === false) {
      return errorToast("Email không hợp lệ");
    }
    if (userAccount.password === "") {
      return errorToast("Mật khẩu không được để trống");
    }
    return result;
  };

  const heightWindow = use100vh();
  return (
    <div className={styles.login} style={{ minHeight: heightWindow }}>
      <div className={styles.wrapper}>
        <form className={styles.form}>
          <div className={cn("h2", styles.title)}>Đăng nhập</div>
          <div className={styles.head}>
            <div className={styles.subtitle}>
              Đăng nhập với tài khoản mạng xã hội
            </div>
            <div className={styles.btns}>
              <button
                onClick={() => {
                  authServices.handleOAuthLogin("Google");
                }}
                type="button"
                className={cn("button-stroke", styles.button)}
              >
                <img src="/assets/google.svg" alt="Google" />
                Google
              </button>
              <button
                type="button"
                className={cn("button-stroke", styles.button)}
                onClick={() => {
                  authServices.handleOAuthLogin("Facebook");
                }}
              >
                <img src="/assets/facebook.svg" width="33px" alt="facebook" />
                Facebook
              </button>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.subtitle}>Hoặc đăng nhập với email</div>
            <TextInput
              className={styles.field}
              name="email"
              type="email"
              placeholder="Địa chỉ Email"
              required
              icon="mail"
              onChange={handleChange}
              value={userAccount.email}
            />
            <TextInput
              className={styles.field}
              name="password"
              type="password"
              placeholder="Mật khẩu"
              required
              icon="lock"
              onChange={handleChange}
              value={userAccount.password}
            />
            <button
              onClick={handleSubmit}
              className={cn("button", styles.button)}
            >
              Đăng nhập
            </button>
            <div className={styles.info} style={{ textAlign: "right" }}>
              <Link className={styles.link} to="../forgot-password">
                Quên mật khẩu?
              </Link>
            </div>
            <div className={styles.note}>
              Trang web này thực hiện cho môn học Phát triển ứng dụng Web nâng
              cao.
            </div>
            <div className={styles.info}>
              Chưa có tài khoản?{" "}
              <Link className={styles.link} to="../sign-up">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </form>
      </div>
      <SignInModal
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
          onClick={() => {
            handleUpdateRole();
          }}
        >
          Chọn
        </button>
      </SignInModal>
    </div>
  );
};

export default SignIn;
