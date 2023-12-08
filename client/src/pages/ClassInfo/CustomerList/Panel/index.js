import React, { useState } from "react";
import cn from "classnames";
import styles from "./Panel.module.sass";
import Icon from "../../../../components/Icon";

const Panel = ({ addStudent, outGroup }) => {
  return (
    <div className={cn("panel", styles.panel)}>
      <div className={styles.info}>
        {/* <Icon name="check-all" size="24" />
        Last saved <span>Oct 4, 2021 - 23:32</span> */}
      </div>
      <div className={styles.btns}>
        <button className={cn("button", styles.button)} onClick={addStudent}>
          Thêm thành viên
        </button>
        <button
          className={cn("button-stroke", styles.button)}
          onClick={outGroup}
        >
          Rời lớp học
        </button>
      </div>
    </div>
  );
};

export default Panel;
