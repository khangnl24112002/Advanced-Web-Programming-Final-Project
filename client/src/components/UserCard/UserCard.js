import React, { useState } from "react";
import cn from "classnames";
import styles from "./UserCard.module.sass";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "../Modal";
import Share from "../ModalProduct/Product/Panel/Share";
import EditProfileForm from "../EditProfileForm/EditProfileForm";
import { useAuth } from "../../hooks/useAuth";
import { set } from "react-hook-form";
import { userServices } from "../../services/UserServices";
import { errorToast, successToast } from "../../utils/toast";

const UserCard = ({
  uniqueId,
  email,
  firstName,
  lastName,
  image,
  status,
  role,
}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const { token } = useAuth();
  const user = {
    firstName,
    lastName,
    email,
    image,
    uniqueId,
  };
  const [userProfile, setUserProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const handleClick = () => {
    setVisibleModal(true);
  };
  const handleCLickBanUser = async () => {
    const response = await userServices.update(
      email,
      {
        isBan: true,
      },
      token
    );
    if (response.status) {
      successToast(response.message);
      window.location.reload();
    } else {
      errorToast(response.message);
    }
  };
  return (
    <>
      <Card className={styles.userCard}>
        {/* <Card.Header>
          <Card.Title
            style={{
              display: "flex",
              justifyContent: "end",
            }}
            onClick={handleCLickBanUser}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-ban"
              color="red"
              viewBox="0 0 16 16"
            >
              <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
            </svg>
          </Card.Title>
        </Card.Header> */}

        <Card.Body className={styles.cardBody}>
          <Card.Img
            style={{
              height: "10rem",
              objectFit: "cover",
              marginBottom: "10px",
            }}
            variant="top"
            src={image}
          />
          <Card.Title>{firstName + " " + lastName}</Card.Title>
          <Card.Text>Email: {email}</Card.Text>
          {uniqueId ? (
            <Card.Text>Mã sinh viên: {uniqueId}</Card.Text>
          ) : (
            <Card.Text>Mã sinh viên: Chưa có thông tin</Card.Text>
          )}
          <Card.Text>
            Trạng thái hoạt động:{" "}
            <span
              style={
                status === "Online"
                  ? { color: "green", fontWeight: 700 }
                  : { color: "red", fontWeight: 700 }
              }
            >
              {status}
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={handleClick}
                className={cn("button", styles.button)}
              >
                Xem TK
              </button>
              <button
                onClick={handleCLickBanUser}
                className={cn("button", styles.button)}
              >
                Khóa TK
              </button>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
      <Modal
        outerClassName={styles.outer}
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      >
        <EditProfileForm
          user={userProfile}
          token={token}
          isEditing={isEditing}
          editProfile={(value) => {
            setUserProfile(value);
          }}
          toggleEdit={(value) => setIsEditing(value)}
          isShow={true}
          isShowInputStudentId={role === "student"}
        />
      </Modal>
    </>
  );
};

export default UserCard;
