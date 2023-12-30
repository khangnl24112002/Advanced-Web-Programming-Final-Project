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
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Dropdown from "../../../../components/Dropdown";

import { useNavigate } from "react-router-dom";
const SettingModal = ({ visible, onClose, classDetail, item }) => {
  const { control, handleSubmit, setError } = useForm({
    // defaultValues: {}; you can populate the fields by this attribute
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "score",
  });

  const arrangeOption = ["Tăng dần", "Giảm dần"];
  const [optionValue, setOptionValue] = useState(arrangeOption[0]);
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
  // Khởi tạo state từ initialState
  const [createClass, setCreateClass] = useState(initialState);
  // Xử lý việc tạo lớp
  const handleCreateClass = async () => {};

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
            classCardHead={cn(styles.head, { [styles.hidden]: visible })}
            head={
              <div className={styles.dropdownBox}>
                <Dropdown
                  className={styles.dropdown}
                  classDropdownHead={styles.dropdownHead}
                  value={optionValue}
                  setValue={setOptionValue}
                  options={arrangeOption}
                  small
                />
              </div>
            }
          >
            <form
              className={styles.description}
              onSubmit={handleSubmit((data) => console.log(data))}
            >
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.group}
                  style={{ marginTop: "20px" }}
                >
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={styles.field}
                        label=""
                        type="text"
                        placeholder="Tên cột điểm"
                        required
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                    name={`score.${index}.name`}
                    control={control}
                  />
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={styles.field}
                        label=""
                        type="number"
                        placeholder="Tỉ lệ điểm (%)"
                        required
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                    name={`score.${index}.percentage`}
                    control={control}
                  />
                  <button
                    className={`${styles.field} ${styles.close}`}
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Icon name="close" size="20" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={cn("button-white", styles.button)}
                style={{ marginTop: "20px" }}
                onClick={() => append({ name: "", percentage: "" })}
              >
                Thêm loại điểm
              </button>
              <button
                className={cn("button-white", styles.button)}
                style={{ marginTop: "20px", marginLeft: "20px" }}
                type="submit"
              >
                Submit
              </button>
            </form>
          </Card>
          <Card
            className={cn(styles.card)}
            title="Liên kết mời"
            classTitle={cn("title-green", styles.title)}
          >
            <div className={styles.description}>Liên kết</div>
          </Card>
          <Card
            className={cn(styles.card)}
            title="Upload và Download danh sách học sinh"
            classTitle={cn("title-green", styles.title)}
          >
            <button
              className={cn("button-white", styles.button)}
              style={{ marginTop: "20px" }}
            >
              Upload danh sách
            </button>
            <button
              className={cn("button-white", styles.button)}
              style={{ marginTop: "20px", marginLeft: "20px" }}
            >
              Download danh sách
            </button>
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
