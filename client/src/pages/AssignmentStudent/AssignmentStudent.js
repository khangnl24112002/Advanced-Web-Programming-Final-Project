import React from "react";
import { useSearchParams, useParams } from "react-router-dom";
const AssignmentStudent = () => {
  const { assignmentId } = useParams();
  console.log(assignmentId);
  return <div>AssignmentStudent {assignmentId}</div>;
};

export default AssignmentStudent;
