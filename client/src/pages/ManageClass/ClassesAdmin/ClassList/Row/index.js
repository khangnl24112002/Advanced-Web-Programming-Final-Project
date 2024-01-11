import React, { useState } from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import { classServices } from "../../../../../services/ClassServices.js";
import { successToast, errorToast } from "../../../../../utils/toast.js";
// import Checkbox from "../../../../../components/Checkbox";
import Balance from "../../../../../components/Balance/index.js";
import ModalProduct from "../../../../../components/ModalProduct/index.js";
import Control from "../../Control/index.js";

import { numberWithCommas } from "../../../../../utils.js";

const Row = ({ item, value, onChange, up }) => {
    const [visibleModalProduct, setVisibleModalProduct] = useState(false);
    const handleToggleActive = async (classId, status) => {
        const response = await classServices.toggleActiveClass(classId, status);
        if (response.status) {
            successToast("Đổi trạng thái thành công", 2000);
        } else {
            return errorToast("Đổi trạng thái thất bại");
        }
    };
    return (
        <>
            <div className={styles.row}>
                <div className={styles.col}></div>
                <div className={styles.col}>{item.name}</div>
                <div className={styles.col}>{item.uniqueCode}</div>
                <div className={styles.col}>{item.maximumStudents}</div>
                <div className={styles.col}>
                    {!item.isDisabled ? (
                        <div className={cn("status-green", styles.status)}>
                            Hoạt động
                        </div>
                    ) : (
                        <div className={cn("status-red", styles.status)}>
                            Không hoạt động
                        </div>
                    )}
                </div>
                <div
                    className={styles.col}
                    onClick={() => {
                        handleToggleActive(item.id, !item.isDisabled);
                    }}
                >
                    Toggle
                </div>
            </div>
            <ModalProduct
                hidden={true}
                item={item}
                classDetail={item}
                visible={visibleModalProduct}
                onClose={() => setVisibleModalProduct(false)}
            />
        </>
    );
};

export default Row;
