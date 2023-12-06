import React from "react";
import cn from "classnames";
import styles from "./ClassesDashboard.module.sass";
import Classes from "./Classes";

const ClassesDashboard = () => {
    return (
        <>
            <div className={styles.section}>
                <Classes />
            </div>
        </>
    );
};

export default ClassesDashboard;
