import React, { useState } from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
// import Checkbox from "../../../../../components/Checkbox";
import ModalProduct from "../../../../components/ModalProduct/index.js";
import MarkAssignmentModal from "../../MarkAssignmentModal/index.js";

const Row = ({ item, value, onChange, up }) => {
  console.log(item);
  const [visibleModalProduct, setVisibleModalProduct] = useState(false);

  return (
    <>
      <div className={styles.row} onClick={() => setVisibleModalProduct(true)}>
        <div className={styles.col}></div>
        <div className={styles.col}>{item.lastName + " " + item.firstName}</div>
        <div className={styles.col}>{item.studentId}</div>
        <div className={styles.col}>{item.createdAt}</div>
      </div>
      {/* <ModalProduct
        item={item}
        classDetail={item}
        visible={visibleModalProduct}
        onClose={() => setVisibleModalProduct(false)}
      /> */}
      <MarkAssignmentModal
        onClose={() => setVisibleModalProduct(false)}
        visible={visibleModalProduct}
      />
    </>
  );
};

export default Row;
