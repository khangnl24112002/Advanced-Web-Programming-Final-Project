import React from "react";
import styles from "./ClassesDashboard.module.sass";
import Classes from "./Classes/index";

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
