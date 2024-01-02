import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./AssignmentTeacher.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import UpdateAssignmentModal from "./UpdateAssignmentModal";
import StudentSubmissionList from "./StudentSubmissionList";
import * as dayjs from "dayjs";
import { assignmentServices } from "../../services/AssignmentServices";
import { errorToast } from "../../utils/toast";
const AssignmentTeacher = () => {
  const { assignmentId, classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState("");
  useEffect(() => {
    setIsLoading(true);
    const getAssignmentData = async () => {
      const assignmentDetailResponse =
        await assignmentServices.getAssignmentById(assignmentId);
      if (assignmentDetailResponse.status) {
        setAssignmentData(assignmentDetailResponse.data);
      } else {
        return errorToast("Không thể lấy được dữ liệu. Vui lòng thử lại sau.");
      }
    };
    getAssignmentData();
    setIsLoading(false);
  }, [assignmentId]);
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
            title={`${assignmentData.grades.name} (${assignmentData.grades.percentage}%)`}
            classTitle={cn("title-purple", styles.title)}
            classCardHead={cn(styles.head)}
          >
            <div
              className={styles.description}
              style={{ display: "flex", flexDirection: "column", gap: "25px" }}
            >
              <div className={styles.content}>
                Tên bài tập: {assignmentData.name}
              </div>
              <div className={styles.content}>{assignmentData.description}</div>
              {assignmentData.metadata && (
                <div className={styles.content}>
                  File đính kèm:{" "}
                  <a href={assignmentData.metadata}>
                    {assignmentData.metadata}
                  </a>
                </div>
              )}
              <div className={styles.content}>
                Hạn nộp: {dayjs(assignmentData.dueDate).format("DD/MM/YYYY")}
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
            {!isLoading && assignmentData.studentAssignments?.length > 0 && (
              <div className={styles.classes}>
                <div className={styles.wrapper}>
                  <StudentSubmissionList
                    items={assignmentData.studentAssignments}
                  />
                </div>
              </div>
            )}
            {!isLoading && assignmentData.studentAssignments?.length <= 0 && (
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
