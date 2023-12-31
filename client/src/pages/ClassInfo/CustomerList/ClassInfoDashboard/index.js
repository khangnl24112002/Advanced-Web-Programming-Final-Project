import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import styles from "./ClassInfoDashboard.module.sass";
import Card from "./Card";
import { errorToast } from "../../../../utils/toast";
import { classServices } from "../../../../services/ClassServices";
import { useNavigate } from "react-router-dom";
const ClassInfoDashboard = ({ classId }) => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      name: "Assignment 1",
    },
    {
      id: 2,
      name: "Assignment 2",
    },
  ]);
  const [classInfo, setClassInfo] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    // Call API to get all assignment here
    // Call API to get class info here
    const getClassInfo = async () => {
      const response = await classServices.getClassDetail(classId);
      if (response.status) {
        setClassInfo(response.data);
      } else {
        return errorToast(
          "Có sự cố xảy ra, không thể lấy được thông tin lớp. Vui lòng thử lại sau."
        );
      }
    };
    getClassInfo();
  }, []);
  const goToAssignment = (id) => {
    console.log(id);
    navigate(`assignment/${id}`, { replace: true });
  };
  return (
    <div>
      {assignments &&
        assignments.map((assignment, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                goToAssignment(assignment.id);
              }}
            >
              <Card
                className={cn(styles.card)}
                title={`Giáo viên Nguyễn Nhật Khang đã tạo bài tập mới`}
                classTitle={cn("title-green", styles.title)}
              >
                <div className={styles.description}>
                  <div className={styles.field}>Thời gian: 10 phút</div>
                  <div>Hạn nộp: 20/03/2024</div>
                </div>
              </Card>
            </div>
          );
        })}
    </div>
  );
};

export default ClassInfoDashboard;
