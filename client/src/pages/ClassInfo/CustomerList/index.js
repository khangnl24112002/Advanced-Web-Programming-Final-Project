import React, { useState, useEffect } from "react";
import styles from "./CustomerList.module.sass";
import cn from "classnames";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import TextInput from "../../../components/TextInput";
import Table from "./Table";
import GradeTable from "./GradeTable";
import Panel from "./Panel";
import Details from "./Details";
import Modal from "./Modal";
import Icon from "../../../components/Icon";
import { errorToast, successToast } from "../../../utils/toast";
import { useAuth } from "../../../hooks/useAuth";
import { classServices } from "../../../services/ClassServices";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { EMAIL_REGEX } from "../../../constants";
import Dropdown from "../../../components/Dropdown";
import SettingModal from "./SettingModal";
const optionListTeacher = ["Danh sách", "Bảng điểm"];
const CustomerList = () => {
  const { user, token } = useAuth();
  const [classInfo, setClassInfo] = useState();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [gradeComposition, setGradeComposition] = useState([]);
  const [urlClass, setUrlClass] = useState("http://example.com");
  const [activeUser, setActiveUser] = useState({});
  const inputRef = useRef(null);
  const [optionValue, setOptionValue] = useState(optionListTeacher[0]);
  const [visibleSettingModal, setVisibleSettingModal] = useState(false);
  const handleActive = (user) => {
    console.log(user);
    setActiveUser(user);
  };

  const [isLoading, setIsLoading] = useState(false);
  const { classId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await classServices.getClassDetail(token, classId);
      const responseData = await response.data;
      setClassInfo({
        name: response.data.name,
        description: response.data.description,
        maximumStudents: response.data.maximumStudents,
      });
      const loadTeachers = [];
      for (const key in responseData.teachers) {
        loadTeachers.push({
          name:
            responseData.teachers[key].firstName +
            " " +
            responseData.teachers[key].lastName,
          email: responseData.teachers[key].email,
          role: "Giáo viên",
        });
      }
      setTeachers(loadTeachers);

      const loadStudents = [];
      for (const key in responseData.students) {
        loadStudents.push({
          name:
            responseData.students[key].firstName +
            " " +
            responseData.students[key].lastName,
          email: responseData.students[key].email,
          role: "Học sinh",
        });
      }
      setStudents(loadStudents);

      const getUrlClass = async () => {
        const response = await classServices.getInviteLinkClass(classId);
        if (response.status) {
          setUrlClass(response.data);
        } else {
        }
      };
      getUrlClass();

      // Fetch grade composition
      const getClassGradeComposition = async () => {
        const response = await classServices.getClassGradeComposition(classId);
        if (response.status) {
          let gradeCompositionData = [];
          response.data.map((grade, index) => {
            gradeCompositionData.push({
              name: grade.name,
              percentage: grade.percentage,
            });
          });
          setGradeComposition(gradeCompositionData);
        } else {
        }
      };
      getClassGradeComposition();

      setIsLoading(false);
    };

    fetchData();
  }, [token]);

  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = (e) => {
    alert();
  };

  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState(null);

  const handleInviteMember = async () => {
    // Sử dụng current để truy cập đến phần tử DOM
    const email = inputRef.current.value;
    if (validateData(email) === 1) {
      // 2. Gọi API để kiểm tra xem email có tồn tại hay không
      const response = await classServices.checkEmailExist(classId, email);
      if (response.status) {
        return successToast("Đã gửi lời mời!", 2000);
      } else {
        return errorToast("Tài khoản này chưa tham gia vào ứng dụng!");
      }
    }
  };

  const validateData = (email) => {
    let result = 1;
    if (email === "") {
      return errorToast("Email không được để trống");
    }
    if (EMAIL_REGEX.test(email) === false) {
      return errorToast("Email không hợp lệ");
    }
    return result;
  };

  // Xử lí việc rời khỏi lớp học
  const handleOutClass = () => {};

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
            <div className={styles.dropdownBox}>
              <Dropdown
                className={styles.dropdown}
                classDropdownHead={styles.dropdownHead}
                value={optionValue}
                setValue={setOptionValue}
                options={optionListTeacher}
                small
              />
            </div>
            {/**Button xem thông tin cài đặt của lớp học */}
            <button
              style={{ marginLeft: "20px" }}
              className={cn("button-square-stroke button-small", styles.button)}
              onClick={() => setVisibleSettingModal(true)}
            >
              <Icon name="setting" size="24" />
            </button>
          </>
        }
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading && (students || teachers) && (
          <div className={cn(styles.row, { [styles.flex]: visible })}>
            {optionValue === "Danh sách" && (
              <Table
                className={styles.table}
                activeTable={visible}
                setActiveTable={setVisible}
                teachers={teachers}
                students={students}
                onActive={handleActive}
              />
            )}

            {optionValue === "Bảng điểm" && (
              <GradeTable
                className={styles.table}
                activeTable={visible}
                setActiveTable={setVisible}
                teachers={teachers}
                students={students}
                onActive={handleActive}
              />
            )}

            <Details
              className={styles.details}
              onClose={() => setVisible(false)}
              activeUser={activeUser}
            />
          </div>
        )}
        {!isLoading && !teachers && !students && (
          <div style={{ textAlign: "center" }}>
            Không tìm thấy thành viên nào trong lớp
          </div>
        )}
      </Card>
      {!isLoading && gradeComposition && (
        <>
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
          <SettingModal
            urlClass={urlClass}
            keyInvite={"ZA412F"}
            classId={classId}
            classInfo={classInfo}
            gradeComposition={gradeComposition}
            visible={visibleSettingModal}
            onClose={() => setVisibleSettingModal(false)}
          />
        </>
      )}
    </>
  );
};

export default CustomerList;
