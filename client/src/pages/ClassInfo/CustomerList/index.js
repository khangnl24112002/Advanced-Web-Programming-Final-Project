import React, { useState } from "react";
import styles from "./CustomerList.module.sass";
import cn from "classnames";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Filters from "../../../components/Filters";
import TextInput from "../../../components/TextInput";
import Settings from "./Settings";
import Table from "./Table";
import Panel from "./Panel";
import Details from "./Details";
import Modal from "./Modal";
import Icon from "../../../components/Icon";
import { errorToast, successToast } from "../../../utils/toast";
// const navigation = ["Active", "New"];

const CustomerList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = (e) => {
    alert();
  };
  const handleInviteMember = () => {
    return successToast("Đã gửi lời mời!", 2000);
  };
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState(true);
  const [content, setContent] = useState(null);
  const [urlClass, setUrlClass] = useState("http://example.com");
  // Xử lí việc rời khỏi lớp học
  const handleOutClass = () => {};

  // Modal xử lí việc lấy url lớp học
  const handleGetUrl = () => {
    setOpenModal(true);
    setContent(
      <>
        <div className={cn("title-green", styles.modaltitle)}>
          Lấy URL lớp học
        </div>
        <div className={styles.info}>
          Đây là đường dẫn đến lớp học của bạn <a href={urlClass}>{urlClass}</a>
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
            {/**Button dùng để tạo lớp học */}
            <button
              className={cn("button-small", styles.button)}
              onClick={handleGetUrl}
            >
              Lấy URL lớp học
            </button>
            {/* <div className={styles.nav}>
                            {navigation.map((x, index) => (
                                <button
                                    className={cn(styles.link, {
                                        [styles.active]: index === activeIndex,
                                    })}
                                    onClick={() => setActiveIndex(index)}
                                    key={index}
                                >
                                    {x}
                                </button>
                            ))}
                        </div> */}
            {/* <Filters
                            className={styles.filters}
                            title="Showing 10 of 24 customer"
                        >
                            <Settings />
                        </Filters> */}
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
      <Panel addStudent={handleAddingStudent} outGroup={handleOutGroup} />
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
