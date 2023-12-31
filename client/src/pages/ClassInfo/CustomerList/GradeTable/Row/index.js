import React, { useState } from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Checkbox from "../../../../../components/Checkbox";
import Balance from "../../../../../components/Balance";
import { useAuth } from "../../../../../hooks/useAuth";

const Row = ({
    item,
    value,
    onChange,
    activeTable,
    setActiveTable,
    activeId,
    setActiveId,
    onChoose,
    gradeComposition,
}) => {
    const handleClick = (id) => {
        setActiveTable(true);
        setActiveId(id);
        console.log(id);
        onChoose(id);
    };
    const { user } = useAuth();

    return (
        <>
            <div
                className={cn(
                    styles.row,
                    { [styles.selected]: activeId === item.id },
                    { [styles.active]: activeTable }
                )}
            >
                {/* <div className={styles.col}>
                    <Checkbox
                        className={styles.checkbox}
                        value={value}
                        onChange={onChange}
                    />
                </div> */}
                <div className={styles.col}>
                    <div className={styles.item}>
                        <div className={styles.avatar}>
                            <img src="/assets/sample-avatar.jpg" alt="Avatar" />
                        </div>
                        <div className={styles.details}>
                            <div className={styles.user}>{item.name}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.col}>
                    <div className={styles.email}>20120196</div>
                </div>

                {gradeComposition &&
                    gradeComposition.map((grade) => (
                        <div className={styles.col}>
                            {/* <div className={styles.lifetime}> */}
                            <div>10</div>
                            {/* <Balance
                                className={styles.balance}
                                value={item.balance}
                            /> */}
                            {/* </div> */}
                        </div>
                    ))}
                {user.role === "teacher" && (
                    <div className={styles.col}>
                        <div className={styles.editbutton}>Edit</div>
                    </div>
                )}
                {/* <div className={styles.col}>{item.comments}</div>
                <div className={styles.col}>{item.likes}</div> */}
            </div>
        </>
    );
};

export default Row;
