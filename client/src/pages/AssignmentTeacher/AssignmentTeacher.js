import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./AssignmentTeacher.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import UpdateAssignmentModal from "./UpdateAssignmentModal";
import StudentSubmissionList from "./StudentSubmissionList";
import * as dayjs from "dayjs";
const AssignmentTeacher = () => {
  const { assignmentId, classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    // Get assignment by assignment by Id
    const assignmentDetailResponse = {
      id: 34,
      name: "Kiểm tra miệng",
      percentage: 10,
      status: "OPEN",
      classId: 14,
      createdAt: "2024-01-02T08:40:03.236Z",
      updatedAt: "2024-01-02T08:40:03.236Z",
      assignments: {
        id: 10,
        classId: 14,
        name: "Ánh xạ tuyến tính",
        gradeId: 34,
        teacherId: "c437dd89-b20c-4200-b2e8-5c2b2c5a443a",
        description:
          '"Trong ánh xạ tuyến tính, điều gì xảy ra nếu một vector không thay đổi khi ánh xạ được áp dụng?"\n\nA) Vector đó không thuộc vào miền xác định của ánh xạ\nB) Ánh xạ không phải là tuyến tính\nC) Vector đó là vector không vị tự do\nD) Vector đó nằm trong nhóm hạng của ánh xạ',
        status: "OPEN",
        metadata: null,
        publishedAt: "2024-01-02T08:41:01.578Z",
        dueDate: "2024-01-03T00:00:00.000Z",
        disabledAt: null,
        isDisabled: false,
        createdAt: "2024-01-02T08:41:01.578Z",
        updatedAt: "2024-01-02T08:41:01.578Z",
        studentAssignments: [
          {
            firstName: "Minh",
            lastName: "Nguyễn Anh",
            studentId: "20120333",
            createdAt: "22-03-2024",
            id: "ffazz",
            assignmentSubmissionId: 1,
          },
          {
            firstName: "Minh",
            lastName: "Nguyễn Anh",
            studentId: "20120333",
            createdAt: "22-03-2024",
            id: "ffazz",
            assignmentSubmissionId: 1,
          },
          {
            firstName: "Minh",
            lastName: "Nguyễn Anh",
            studentId: "20120333",
            createdAt: "22-03-2024",
            id: "ffazz",
            assignmentSubmissionId: 1,
          },
        ],
      },
    };
    setAssignmentData(assignmentDetailResponse);
    setIsLoading(false);
  }, []);
  const handleUploadAssignment = () => {
    setOpenModal(true);
  };
  const handleDeleteAssignment = async () => {
    alert("Đã xóa bài tập");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && assignmentData && (
        <>
          <Card
            className={styles.card}
            title={
              `${assignmentData.name}` + " " + `(${assignmentData.percentage}%)`
            }
            classTitle={cn("title-purple", styles.title)}
            classCardHead={cn(styles.head)}
          >
            <div
              className={styles.description}
              style={{ display: "flex", flexDirection: "column", gap: "25px" }}
            >
              <div className={styles.content}>
                Tên bài tập: {assignmentData.assignments.name}
              </div>
              <div className={styles.content}>
                {assignmentData.assignments.description}
              </div>
              {assignmentData.assignments.metadata && (
                <div className={styles.content}>
                  File đính kèm:{" "}
                  <a href={assignmentData.assignments.metadata}>
                    {assignmentData.assignments.metadata}
                  </a>
                </div>
              )}
              <div className={styles.content}>
                Hạn nộp:{" "}
                {dayjs(assignmentData.assignments.dueDate).format("DD/MM/YYYY")}
              </div>
            </div>
            <div
              style={{
                marginTop: "25px",
                display: "flex",
                flexDirection: "row",
                gap: "20px",
              }}
            >
              <button
                className={cn("button", styles.button)}
                onClick={handleUploadAssignment}
              >
                Cập nhật bài tập
              </button>
              <button
                className={cn("button", styles.button)}
                onClick={handleDeleteAssignment}
              >
                Xóa bài tập
              </button>
            </div>
            <UpdateAssignmentModal
              visible={openModal}
              classId={classId}
              onClose={() => {
                setOpenModal(false);
              }}
            />
          </Card>
          <Card
            className={styles.card}
            title="Sinh viên đã nộp "
            classTitle={cn("title-green", styles.title)}
            classCardHead={cn(styles.head)}
          >
            {!isLoading &&
              assignmentData.assignments.studentAssignments.length > 0 && (
                <div className={styles.classes}>
                  <div className={styles.wrapper}>
                    <StudentSubmissionList
                      items={assignmentData.assignments.studentAssignments}
                    />
                  </div>
                </div>
              )}
            {!isLoading &&
              assignmentData.assignments.studentAssignments.length <= 0 && (
                <div style={{ textAlign: "center" }}>
                  Không có sinh viên nào nộp bài.
                </div>
              )}
          </Card>
        </>
      )}
    </div>
  );
};

export default AssignmentTeacher;
