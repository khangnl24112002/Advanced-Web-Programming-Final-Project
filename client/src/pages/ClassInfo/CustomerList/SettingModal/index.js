import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { createPortal } from "react-dom";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import styles from "./SettingModal.module.sass";
import Icon from "../../../../components/Icon";
import Card from "../../../../components/Card";
import TextInput from "../../../../components/TextInput";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Dropdown from "../../../../components/Dropdown";
import { errorToast, successToast } from "../../../../utils/toast";

const SettingModal = ({
  visible,
  onClose,
  classDetail,
  item,
  classId,
  urlClass,
  keyInvite,
}) => {
  const { control: controlScore, handleSubmit: handleSubmitScore } = useForm({
    // defaultValues: {}; you can populate the fields by this attribute
    defaultValues: {
      score: [{ name: "zzz", percentage: 3 }],
    },
  });
  const { control: controlClassInfo, handleSubmit: handleSubmitClassInfo } =
    useForm({
      defaultValues: {
        name: "fff",
        maximumStudents: "zzz",
        description: "aaa",
      },
    });
  const {
    fields: fieldsScore,
    append: appendScore,
    remove: removeScore,
  } = useFieldArray({
    control: controlScore,
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

  // Handle submit score compositions
  const onSubmitScore = (data) => {
    const requestData = { ...data, classId };
    console.log(requestData);
  };

  // Handle submit class info
  const onSubmitClassInfo = (classInfo) => {
    const requestData = { ...classInfo, classId };
    console.log(requestData);
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
            <form
              onSubmit={handleSubmitClassInfo(onSubmitClassInfo)}
              className={styles.description}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Controller
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={styles.field}
                    label="Tên lớp học"
                    type="text"
                    required
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
                name="name"
                control={controlClassInfo}
              />

              <Controller
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={styles.field}
                    label="Mô tả lớp học"
                    type="text"
                    required
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
                name="description"
                control={controlClassInfo}
              />
              <Controller
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={styles.field}
                    label="Số lượng tối đa"
                    type="number"
                    required
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
                name="maximumStudents"
                control={controlClassInfo}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className={cn("button", styles.button)}
                  style={{ marginTop: "20px", marginLeft: "20px" }}
                  type="submit"
                >
                  Cập nhật
                </button>
              </div>
            </form>
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
              onSubmit={handleSubmitScore(onSubmitScore)}
            >
              {fieldsScore.map((item, index) => (
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
                    control={controlScore}
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
                    control={controlScore}
                  />
                  <button
                    className={`${styles.field} ${styles.close}`}
                    onClick={() => {
                      removeScore(index);
                    }}
                  >
                    <Icon name="close" size="20" />
                  </button>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  className={cn("button", styles.button)}
                  style={{ marginTop: "20px" }}
                  onClick={() => appendScore({ name: "", percentage: "" })}
                >
                  Thêm loại điểm
                </button>
                <button
                  className={cn("button", styles.button)}
                  style={{ marginTop: "20px", marginLeft: "20px" }}
                  type="submit"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </Card>
          <Card
            className={cn(styles.card)}
            title="Liên kết mời"
            classTitle={cn("title-green", styles.title)}
          >
            {/**Url invite */}
            <div className={styles.description}>
              <div className={styles.info}>
                Đây là đường dẫn đến lớp học của bạn: <br /> {urlClass}
              </div>
              <div>
                <button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(urlClass)
                      .then(() => {
                        return successToast("Đã sao chép!", 1000);
                      })
                      .catch((err) => {
                        return errorToast("Sao chép thất bại!", 1000);
                      });
                  }}
                  className={cn("button", styles.button)}
                >
                  <span>Copy</span>
                  <Icon name="arrow-right" size="24" />
                </button>
              </div>
            </div>

            <div className={styles.description}>
              <div className={styles.info}>
                Đây là mã mời đến lớp học của bạn: <br /> {keyInvite}
              </div>
              {/**Key Invite */}
              <div>
                <button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(keyInvite)
                      .then(() => {
                        return successToast("Đã sao chép!", 1000);
                      })
                      .catch((err) => {
                        return errorToast("Sao chép thất bại!", 1000);
                      });
                  }}
                  className={cn("button", styles.button)}
                >
                  <span>Copy</span>
                  <Icon name="arrow-right" size="24" />
                </button>
              </div>
            </div>
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
        </div>
      </div>
    ),
    document.body
  );
};

export default SettingModal;
