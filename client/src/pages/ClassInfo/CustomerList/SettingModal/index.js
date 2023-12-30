import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { createPortal } from "react-dom";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import styles from "./SettingModal.module.sass";
import Icon from "../../../../components/Icon";
import Card from "../../../../components/Card";
import TextInput from "../../../../components/TextInput";
import { errorToast, successToast } from "../../../../utils/toast";
import { helper } from "../../../../utils/helper";

import { useNavigate } from "react-router-dom";
const SettingModal = ({ visible, onClose, classDetail, item }) => {
  const escFunction = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    if (visible) {
      const target = document.querySelector("#modal-product");
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [visible]);

  // State cho tạo lớp học
  const initialState = {
    name: "",
    maximumStudents: "",
    description: "",
  };

  // dùng hook useNavigate để redirect
  const navigate = useNavigate();

  // Khởi tạo state từ initialState
  const [createClass, setCreateClass] = useState(initialState);

  // Xử lý việc tạo lớp
  const handleCreateClass = async () => {
    // if (validateData(createClass) === 1) {
    //   // Chuyển số lượng về number
    //   const classRequest = {
    //     ...createClass,
    //     maximumStudents: parseInt(createClass.maximumStudents),
    //   };
    //   // Gọi API xử lý
    //   const response = await classServices.createClass(classRequest);
    //   if (response.status) {
    //     // Nếu thành công: thông báo thành công và quay về trang class
    //     successToast("Tạo lớp học thành công!", 2000);
    //     navigate("/classes", { replace: true });
    //   } else {
    //     // Nếu thất bại: thông báo lỗi
    //     return errorToast(response.message);
    //   }
    // }
  };

  // Xử lý validate data
  const validateData = (classInfo) => {
    let result = 1;
    if (classInfo.name === "") {
      return errorToast("Tên lớp không được để trống");
    }
    if (!helper.isPositiveNumber(classInfo.maximumStudents)) {
      return errorToast("Số lượng tối đa không hợp lệ");
    }
    if (classInfo.description === "") {
      return errorToast("Mô tả không được để trống");
    }
    return result;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCreateClass((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return createPortal(
    visible && (
      <div id="modal-product" className={styles.modal}>
        <div className={styles.control}>
          <div className={cn("button-white", styles.button)}>Thông tin lớp</div>
          <button className={styles.close} onClick={onClose}>
            <Icon name="close" size="20" />
          </button>
        </div>
        <div className={styles.outer}>
          <Card
            className={cn(styles.card)}
            title="Thông tin chung"
            classTitle={cn("title-green", styles.title)}
          >
            <div className={styles.description}>
              <TextInput
                className={styles.field}
                label="Tên lớp học"
                name="name"
                type="text"
                required
                onChange={handleChange}
              />
              <TextInput
                className={styles.field}
                label="Mô tả lớp học"
                name="description"
                type="text"
                required
                onChange={handleChange}
              />
              <TextInput
                className={styles.field}
                label="Số lượng tối đa"
                name="maximumStudents"
                type="text"
                required
                onChange={handleChange}
              />
            </div>
          </Card>
          <Card
            className={cn(styles.card)}
            title="Thang điểm"
            classTitle={cn("title-green", styles.title)}
          >
            <div className={styles.description}>Thang điểm ở đây</div>
          </Card>
          <Card
            className={cn(styles.card)}
            title="Liên kết mời"
            classTitle={cn("title-green", styles.title)}
          >
            <div className={styles.description}>Liên kết</div>
          </Card>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className={cn("button", styles.button)}>
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default SettingModal;
