import React from "react";
import { useParams } from "react-router-dom";
import styles from "./AssignmentTeacher.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
const AssignmentTeacher = () => {
  const { assignmentId, classId } = useParams();
  console.log(assignmentId, classId);
  return (
    <Card
      className={styles.card}
      title="Bài tập của bạn"
      classTitle={cn("title-purple", styles.title)}
      classCardHead={cn(styles.head)}
    ></Card>
  );
};

export default AssignmentTeacher;
