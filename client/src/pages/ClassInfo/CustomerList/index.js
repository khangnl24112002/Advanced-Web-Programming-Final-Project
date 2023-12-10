import React, { useEffect, useState } from "react";
import styles from "./CustomerList.module.sass";
import cn from "classnames";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import TextInput from "../../../components/TextInput";
import Table from "./Table";
import Panel from "./Panel";
import Details from "./Details";
import Modal from "./Modal";
import Icon from "../../../components/Icon";
import { errorToast, successToast } from "../../../utils/toast";
import { useAuth } from "../../../hooks/useAuth";
import { classServices } from "../../../services/ClassServices";
import { EMAIL_REGEX } from "../../../constants";
import { useRef } from "react";

// const navigation = ["Active", "New"];

const CustomerList = ({ classId }) => {
  // Lấy userInfo
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [content, setContent] = useState(null);
  const [urlClass, setUrlClass] = useState("http://example.com");
  const inputRef = useRef(null);
  const handleSubmit = (e) => {
    alert();
  };
  const handleInviteMember = async () => {
    // Sử dụng current để truy cập đến phần tử DOM
    const email = inputRef.current.value;
    if (validateData(email) === 1) {
      // 2. Gọi API để kiểm tra xem email có tồn tại hay không
      const response = await classServices.checkEmailExist(classId, email);
      console.log(response);
      return successToast("Đã gửi lời mời!", 2000);
    }
  };

  // Xử lí việc rời khỏi lớp học
  const handleOutClass = () => {};

  // Xử lí việc lấy URL của lớp học
  useEffect(() => {
    const getUrlClass = async () => {
      const response = await classServices.getInviteLinkClass(classId);
      console.log(response);
      if (response.status) {
        setUrlClass(response.data);
      } else {
      }
    };
    getUrlClass();
  }, []);

  const validateData = (email) => {
    console.log(email);
    let result = 1;
    if (email === "") {
      return errorToast("Email không được để trống");
    }
    if (EMAIL_REGEX.test(email) === false) {
      return errorToast("Email không hợp lệ");
    }
    return result;
  };

  // Modal xử lí việc lấy url lớp học
  const handleGetUrl = () => {
    setOpenModal(true);
    setContent(
      <>
        <div className={cn("title-green", styles.modaltitle)}>
          Lấy URL lớp học
        </div>
        <div className={styles.info}>
          Đây là đường dẫn đến lớp học của bạn: {urlClass}
        </div>
        <div className={styles.foot}>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            className={cn("button-stroke", styles.button)}
          >
            <span>Quay lại</span>
          </button>
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
      </>
    );
  };

  // Modal để thêm học sinh
  const handleAddingStudent = () => {
    setOpenModal(true);
    setContent(
      <>
        <div className={cn("title-green", styles.modaltitle)}>
          Thêm thành viên
        </div>
        <div className={styles.info}>
          Thêm các thành viên vào lớp học của bạn.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          <TextInput
            className={styles.field}
            label="Địa chỉ email"
            name="title"
            type="text"
            required
            innerRef={inputRef}
          />
          <button
            className={cn("button-stroke", styles.button)}
            onClick={handleInviteMember}
          >
            <span>Thêm</span>
          </button>
        </div>
        <div className={styles.foot}>
          <button
            className={cn("button-stroke", styles.button)}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <span>Quay lại</span>
          </button>
        </div>
      </>
    );
  };
  // Modal để show xác nhận rời khỏi lớp
  const handleOutGroup = () => {
    setOpenModal(true);
    setContent(
      <>
        <div className={cn("title-green", styles.modaltitle)}>
          Xác nhận rời lớp
        </div>
        <div className={styles.info}>
          Bạn thật sự muốn rời khỏi lớp học này chứ?
        </div>
        <div className={styles.foot}>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            className={cn("button-stroke", styles.button)}
          >
            <span>Quay lại</span>
          </button>
          <button className={cn("button", styles.button)}>
            <span>Rời lớp</span>
            <Icon name="arrow-right" size="24" />
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Card
        className={styles.card}
        title="Thông tin lớp học"
        classTitle={cn("title-purple", styles.title)}
        classCardHead={cn(styles.head, { [styles.hidden]: visible })}
        head={
          <>
            <Form
              className={styles.form}
              value={search}
              setValue={setSearch}
              onSubmit={() => handleSubmit()}
              placeholder="Tìm theo tên hoặc theo email"
              type="text"
              name="search"
              icon="search"
            />
            {/**Button dùng để lấy url lớp học.
             * Nếu role = 4 (Giáo viên) thì mới có thể lấy URL lớp học
             */}
            {user.role === "teacher" ? (
              <button
                className={cn("button-small", styles.button)}
                onClick={handleGetUrl}
              >
                Lấy URL lớp học
              </button>
            ) : null}
          </>
        }
      >
        <div className={cn(styles.row, { [styles.flex]: visible })}>
          <Table
            className={styles.table}
            activeTable={visible}
            setActiveTable={setVisible}
          />
          <Details
            className={styles.details}
            onClose={() => setVisible(false)}
          />
        </div>
      </Card>
      <Panel
        role={user.role}
        addStudent={handleAddingStudent}
        outGroup={handleOutGroup}
      />
      <Modal
        outerClassName={styles.outer}
        visible={openModal}
        onClose={() => setOpenModal(false)}
      >
        {content}
      </Modal>
    </>
  );
};

export default CustomerList;
