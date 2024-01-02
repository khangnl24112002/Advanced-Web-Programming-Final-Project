import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { createPortal } from "react-dom";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import styles from "./MarkAssignmentModal.module.sass";
import Icon from "../../../components/Icon";
import Card from "../../../components/Card";

const MarkAssignmentModal = ({ visible, onClose }) => {
  const escFunction = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    if (visible) {
      const target = document.querySelector("#modal-product");
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [visible]);

  return createPortal(
    visible && (
      <div id="modal-product" className={styles.modal}>
        <div className={styles.control}>
          <div className={cn("button-white", styles.button)}>Thông tin lớp</div>
          <button className={styles.close} onClick={onClose}>
            <Icon name="close" size="20" />
          </button>
        </div>
        <div className={styles.outer}>
          <Card
            className={cn(styles.card)}
            title="Thông tin chung"
            classTitle={cn("title-green", styles.title)}
          ></Card>

          <Card
            className={cn(styles.card)}
            title="Upload và Download danh sách học sinh"
            classTitle={cn("title-green", styles.title)}
          ></Card>
        </div>
      </div>
    ),
    document.body
  );
};

export default MarkAssignmentModal;
