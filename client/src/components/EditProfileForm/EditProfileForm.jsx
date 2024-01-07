/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { Form } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { successToast } from "../../utils/toast";

import { userServices } from "../../services/UserServices";

import styles from "./EditProfileForm.module.sass";

const EditProfileForm = ({
    user,
    isEditing,
    editProfile,
    toggleEdit,
    token,
    isShow = true
}) => {
    const initalState = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        uniqueId: user.uniqueId ? user.uniqueId : "",
    };
    const initalErrors = {
        email: "",
        firstName: "",
        lastName: "",
        uniqueId: "",
    };

    const [userAccount, setUserAccount] = useState(initalState);
    const [errors, setErrors] = useState(initalErrors);
    const [submitResult, setSubmitResult] = useState("");

    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValidData = validateData(userAccount);
        if (isValidData) {
            const response = await userServices.update(
                userAccount.email,
                userAccount,
                token
            );
            console.log(userAccount);
            if (response.status === true) {
                setUserAccount(response.data);
                setSuccess(true);
                const userStorage = JSON.parse(localStorage.getItem("user"));
                const updatedUser = JSON.stringify({
                    ...userStorage,
                    firstName: userAccount.firstName,
                    lastName: userAccount.lastName,
                    uniqueId: userAccount.uniqueId,
                });
                localStorage.setItem("user", updatedUser);
                editProfile(userAccount);
                // setSubmitResult(response.message);
                successToast(response.message);
                setTimeout(() => {
                    toggleEdit(false);
                    window.location.reload();
                }, 1000);
            } else {
                setSubmitResult(response.message);
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

    const validateData = (userAccount) => {
        setErrors(initalErrors);
        let result = 1;

        if (userAccount.firstName === "") {
            setErrors((prevState) => ({
                ...prevState,
                firstName: "Tên không được để trống",
            }));
            result = 0;
        }
        if (userAccount.lastName === "") {
            setErrors((prevState) => ({
                ...prevState,
                lastName: "Họ không được để trống",
            }));
            result = 0;
        }
        return result;
    };

    return (
        
        (isShow && (
            <main className={styles.editScreen}>
            <div className={styles.editContainer}>
                <div
                    style={
                        isEditing
                            ? { display: "flex", flexDirection: "row" }
                            : { display: "flex", flexDirection: "row-reverse" }
                    }
                >
                    {isEditing && (
                        <div
                            className={styles.backButton}
                            onClick={() => {
                                toggleEdit(false);
                            }}
                        >
                            Back
                        </div>
                    )}
                    {!isEditing && (
                        <div
                            className={styles.forwardButton}
                            onClick={() => {
                                toggleEdit(true);
                            }}
                        >
                            Edit
                        </div>
                    )}
                </div>
                <Form onSubmit={handleSubmit}>
                    <div className={styles.editIntro}>
                        <h3 className={styles["text-center"]}>
                            {isEditing ? "Chỉnh sửa hồ sơ" : "Hồ sơ của bạn"}
                        </h3>
                        <div className={styles.avatarContainer}>
                            <img
                                src="/assets/sample-avatar.jpg"
                                alt="avatar"
                                className={styles.avatarImage}
                            />
                        </div>
                    </div>
                    <div className={styles.editContext}>
                        <FormInput
                            type="email"
                            name="email"
                            title="Email"
                            placeholder="Change Email"
                            value={userAccount.email}
                            onChange={handleChange}
                            error={errors.email}
                            disabled={true}
                        />
                        <div className={styles.formInputLine}>
                            <FormInput
                                type="lastName"
                                name="lastName"
                                title="Họ"
                                placeholder="Enter Last Name"
                                value={user.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                                disabled={!isEditing}
                            />
                            <FormInput
                                type="firstName"
                                name="firstName"
                                title="Tên"
                                placeholder="Enter First Name"
                                value={user.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                                disabled={!isEditing}
                            />
                        </div>
                        {user.role === "student" && (
                            <FormInput
                                type="uniqueId"
                                name="uniqueId"
                                title="Mã số"
                                placeholder="Nhập mã số"
                                value={user.uniqueId ? user.uniqueId : ""}
                                onChange={handleChange}
                                error={errors.uniqueId}
                                disabled={!isEditing}
                            />
                        )}
                        {/* <div className="hiddenElement">
                            <FormInput
                                type="id"
                                name="id"
                                value={userAccount.id}
                                onChange={handleChange}
                            />
                        </div> */}
                        {/* {submitResult !== "" && isEditing ? (
                            <Alert
                                className="my-3"
                                variant={
                                    success === false ? "danger" : "success"
                                }
                            >
                                {submitResult}
                            </Alert>
                        ) : null} */}
                        {isEditing && (
                            <div className="d-grid">
                                <Button type="submit" name="Xác nhận" />
                            </div>
                        )}
                    </div>
                </Form>
            </div>
        </main>
        ))
    );
};

export default EditProfileForm;
