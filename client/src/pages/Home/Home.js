import React, { useEffect, useState } from "react";
import "./style.css";
import UserCard from "../../components/UserCard/UserCard";
import { successToast } from "../../utils/toast";
import { userServices } from "../../services/UserServices";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./Home.module.sass";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/Button/Button";
import cn from "classnames";
import TextInput from "../../components/TextInput";

let statusArr = ["Online", "Offline"];

let avatarArr = ["/assets/male-avatar.jpg", "/assets/female-avatar.jpg"];

const randomStatus = () =>
  statusArr[Math.floor(Math.random() * statusArr.length)];

const randomAvatar = () =>
  avatarArr[Math.floor(Math.random() * avatarArr.length)];

const Home = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await userServices.getAll(token);
      const responseData = await response.data;
      const loadUsers = [];
      for (const key in responseData) {
        loadUsers.push({
          key: key,
          firstName: responseData[key].firstName,
          lastName: responseData[key].lastName,
          email: responseData[key].email,
          uniqueId: responseData[key]?.uniqueId,
          role: responseData[key].role,
        });
      }
      setUsers(loadUsers);
      setIsLoading(false);
    };

    fetchData();
  }, [token]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const response = await userServices.updateStudentIdByFile(formData);
        if (response.status) {
          window.location.reload();
          return successToast("Upload thành công!");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="homeScreen">
      {isLoading && <LoadingSpinner />}
      {users && (
        <>
          <div style={{ padding: "24px 30px" }}>
            <label htmlFor="file" className={styles.import_label}>
              Upload mã số sinh viên
            </label>
            <TextInput id="file" type="file" onChange={handleFileChange} />
            {file && (
              <button
                style={{ marginTop: "20px" }}
                className={cn("button-stroke")}
                onClick={handleUpload}
              >
                <span>Upload</span>
              </button>
            )}
          </div>
          <div className={styles.listUserTitle}>DANH SÁCH USER</div>
          <div className="userContainer">
            {users.map((user) => (
              <UserCard
                key={user.email}
                firstName={user.firstName}
                lastName={user.lastName}
                status={randomStatus()}
                email={user.email}
                image={randomAvatar()}
                uniqueId={user.uniqueId}
                role={user.role}
              />
            ))}
          </div>
        </>
      )}
      {!users && <p>User Home Screen</p>}
    </div>
  );
};

export default Home;
