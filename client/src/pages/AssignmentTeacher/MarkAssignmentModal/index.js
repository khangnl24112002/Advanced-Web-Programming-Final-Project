import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { createPortal } from "react-dom";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import styles from "./MarkAssignmentModal.module.sass";
import Icon from "../../../components/Icon";
import Card from "../../../components/Card";
import LargeInput from "../../../components/LargeInput";
import TextInput from "../../../components/TextInput";
const MarkAssignmentModal = ({ visible, onClose, assignmentDetail }) => {
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
          <div className={cn("button-white", styles.button)}>Bài nộp</div>
          <button className={styles.close} onClick={onClose}>
            <Icon name="close" size="20" />
          </button>
        </div>
        <div className={styles.outer}>
          <Card className={cn(styles.card)}>
            <div style={{ display: "flex", gap: "40px" }}>
              <div style={{ flex: 4 }} className={cn(styles.head)}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div className={cn("title-green", styles.title)}>
                    Bài đã làm
                  </div>
                  <div>Nội dung đã làm</div>
                  <LargeInput
                    className={styles.field}
                    value="Em dell bk làm đâu"
                    disabled
                  />
                  <div>File đính kèm</div>
                  <a
                    href="https://example.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://asdasfdsadfs.com
                  </a>
                </div>
              </div>
              <div style={{ flex: 1 }} className={cn(styles.head)}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div className={cn("title-green", styles.title)}>
                    Chấm điểm
                  </div>
                  <TextInput
                    className={styles.field}
                    label="Số điểm muốn chấm"
                    type="number"
                  />
                  <button
                    className={cn("button", styles.button)}
                    style={{}}
                    type="butotn"
                  >
                    Chấm điểm
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    ),
    document.body
  );
};

export default MarkAssignmentModal;
