import React, { useState } from "react";
import cn from "classnames";
import styles from "./Panel.module.sass";
import Icon from "../../../../components/Icon";
import { useAuth } from "../../../../hooks/useAuth";

const Panel = ({ addStudent, outGroup, role }) => {
    const { user } = useAuth();
    return (
        <div className={cn("panel", styles.panel)}>
            <div className={styles.info}>
                {/* <Icon name="check-all" size="24" />
        Last saved <span>Oct 4, 2021 - 23:32</span> */}
            </div>
            {/**Button thêm thành viên vào lớp học.
             * Chỉ có giáo viên (RoleId === 4) mới có quyền này
             */}
            <div className={styles.btns}>
                {role === "teacher" ? (
                    <button
                        className={cn("button", styles.button)}
                        onClick={addStudent}
                    >
                        Thêm thành viên
                    </button>
                ) : null}

                <button className={cn("button-stroke", styles.button)}>
                    Xuất bảng điểm
                </button>
                {user.role === "teacher" && (
                    <button className={cn("button-stroke", styles.button)}>
                        Nhập bảng điểm
                    </button>
                )}
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
