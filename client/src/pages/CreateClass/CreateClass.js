import React, { useState } from "react";
import cn from "classnames";
import styles from "./CreateClass.module.sass";
import Card from "../../components/Card";
import TextInput from "../../components/TextInput";
import Panel from "./Panel";
const CreateClass = ({ className }) => {
  // Giao diện màn hình tạo lớp học cho giáo viên

  return (
    <>
      <Card
        className={cn(styles.card, className)}
        title="Tạo lớp học"
        classTitle={cn("title-green", styles.title)}
      >
        <div className={styles.description}>
          <TextInput
            className={styles.field}
            label="Tên lớp học"
            name="title"
            type="text"
            tooltip="Maximum 100 characters. No HTML or emoji allowed"
            required
          />
          <TextInput
            className={styles.field}
            label="Mô tả lớp học"
            name="title"
            type="text"
            tooltip="Maximum 100 characters. No HTML or emoji allowed"
            required
          />
          <TextInput
            className={styles.field}
            label="Số lượng tối đa"
            name="title"
            type="text"
            tooltip="Maximum 100 characters. No HTML or emoji allowed"
            required
          />
        </div>
      </Card>
      <Panel />
    </>
  );
};

export default CreateClass;
