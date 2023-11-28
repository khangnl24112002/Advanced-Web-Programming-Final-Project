import React, { useState } from "react";
import cn from "classnames";
import styles from "./ResetPassword.module.sass";
import { use100vh } from "react-div-100vh";
import { getTokenFromURL } from "../../utils/getTokenFromURL";
import TextInput from "../../components/TextInput";
import { useAuth } from "../../hooks/useAuth";
import { authServices } from "../../services/AuthServices";
import { errorToast } from "../../utils/toast";

const ResetPassword = () => {
    const initalState = {
        password: "",
        confirmedPassword: "",
    };
    const [userAccount, setUserAccount] = useState(initalState);
    // const { login } = useAuth();
    const token = getTokenFromURL();
    console.log(token);
    const handleSubmit = async (event) => {
        event.preventDefault();
        // const isValidData = validateData(userAccount);
        // if (isValidData === 1) {
        //     const response = await authServices.login(userAccount);
        //     if (response.status === true) {
        //         login(response.data.user, response.data.token);
        //     } else {
        //         return errorToast(response.message);
        //     }
        // }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserAccount((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateData = (userAccount) => {
        let result = 1;
        if (userAccount.password === "") {
            return errorToast("Mật khẩu không được để trống");
        }

        if (userAccount.confirmedPassword === "") {
            return errorToast("Xác nhận mật khẩu không được để trống");
        }

        if (userAccount.confirmedPassword === "") {
            return errorToast("Xác nhận mật khẩu phải giống mật khẩu");
        }
        return result;
    };

    const heightWindow = use100vh();
    return (
        <div className={styles.login} style={{ minHeight: heightWindow }}>
            <div className={styles.wrapper}>
                <form className={styles.form}>
                    <div className={cn("h2", styles.title)}>Mật khẩu mới</div>
                    <div className={styles.body}>
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
                        <TextInput
                            className={styles.field}
                            name="confirmedPassword"
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            required
                            icon="lock"
                            onChange={handleChange}
                            value={userAccount.confirmedPassword}
                        />
                        <button
                            onClick={handleSubmit}
                            className={cn("button", styles.button)}
                        >
                            Xác nhận
                        </button>
                        <div className={styles.note}>
                            Trang web này thực hiện cho môn học Phát triển ứng
                            dụng Web nâng cao.
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
