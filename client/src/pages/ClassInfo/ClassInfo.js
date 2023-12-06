import React from "react";
import styles from "./ClassInfo.module.sass";
import CustomerList from "./CustomerList";

const ClassInfo = () => {
    return (
        <>
            <div className={styles.section}>
                <CustomerList />
            </div>
        </>
    );
};

export default ClassInfo;
