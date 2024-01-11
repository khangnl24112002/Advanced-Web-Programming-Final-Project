import React, { useState, useEffect } from "react";
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
  editGrade,
}) => {
  const handleClick = (id) => {
    setActiveTable(true);
    setActiveId(id);
    onChoose(id);
  };
  const [userId, setUserId] = useState();
  useEffect(() => {
    setUserId(item.id);
  }, [item.id]);
  const handleEditGrade = (grade) => {
    editGrade(grade, userId);
  };
  useEffect(() => {
    setUserId(item.id);
    console.log("gradecompo", gradeComposition);
  }, [item.id]);
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
          <div className={styles.email}>
            {item.studentId ? item.studentId : ""}
          </div>
        </div>

        {gradeComposition &&
          gradeComposition.map((grade, index) => (
            <div className={styles.col} key={index}>
              {/* <div className={styles.lifetime}> */}
              <div className={styles.flex}>
                <div>10</div>
                {user.role === "teacher" && (
                  <div
                    className={styles.editIcon}
                    onClick={() => {
                      handleEditGrade(grade);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="10"
                      height="10"
                      viewBox="0 0 50 50"
                    >
                      <path d="M 43.050781 1.9746094 C 41.800781 1.9746094 40.549609 2.4503906 39.599609 3.4003906 L 38.800781 4.1992188 L 45.699219 11.099609 L 46.5 10.300781 C 48.4 8.4007812 48.4 5.3003906 46.5 3.4003906 C 45.55 2.4503906 44.300781 1.9746094 43.050781 1.9746094 z M 37.482422 6.0898438 A 1.0001 1.0001 0 0 0 36.794922 6.3925781 L 4.2949219 38.791016 A 1.0001 1.0001 0 0 0 4.0332031 39.242188 L 2.0332031 46.742188 A 1.0001 1.0001 0 0 0 3.2578125 47.966797 L 10.757812 45.966797 A 1.0001 1.0001 0 0 0 11.208984 45.705078 L 43.607422 13.205078 A 1.0001 1.0001 0 1 0 42.191406 11.794922 L 9.9921875 44.09375 L 5.90625 40.007812 L 38.205078 7.8085938 A 1.0001 1.0001 0 0 0 37.482422 6.0898438 z"></path>
                    </svg>
                  </div>
                )}
              </div>
              {/* <Balance
                {gradeComposition &&
                    gradeComposition.map((grade, index) => (
                        <div className={styles.col} key={index}>
                            {/* <div className={styles.lifetime}> */}
              <div className={styles.flex}>
                <div>10</div>
              </div>
              {/* <Balance
                                className={styles.balance}
                                value={item.balance}
                            /> */}
              {/* </div> */}
            </div>
          ))}

        {/* <div className={styles.col}>{item.comments}</div>
                <div className={styles.col}>{item.likes}</div> */}
      </div>
    </>
  );
};

export default Row;
