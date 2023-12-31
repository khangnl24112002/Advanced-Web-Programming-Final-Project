import React from "react";
import { useParams } from "react-router-dom";
const AssignmentTeacher = () => {
  const { assignmentId } = useParams();
  console.log(assignmentId);
  return <div>AssignmentTeacher {assignmentId}</div>;
};

export default AssignmentTeacher;
