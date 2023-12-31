import React, { useState } from "react";
import styles from "./GradeTable.module.sass";
import cn from "classnames";
import Checkbox from "../../../../components/Checkbox";
import Loader from "../../../../components/Loader";
import Row from "./Row";
import Dropdown from "../../../../components/Dropdown";
import { useAuth } from "../../../../hooks/useAuth";
// data
import { customers } from "../../../../mocks/customers";

const gradeOptions = ["Xuất", "Nhập"];

const Table = ({
    className,
    activeTable,
    setActiveTable,
    teachers,
    students,
    onActive,
    gradeComposition,
}) => {
    const { user } = useAuth();
    const [chooseAll, setСhooseAll] = useState(false);
    const [activeId, setActiveId] = useState(customers[0].id);
    const [gradeOptionValue, setGradeOptionValue] = useState("...");
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleChange = (id) => {
        if (selectedFilters.includes(id)) {
            setSelectedFilters(selectedFilters.filter((x) => x !== id));
        } else {
            setSelectedFilters((selectedFilters) => [...selectedFilters, id]);
        }
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={cn(styles.table)}>
                <div
                    className={cn(styles.row, { [styles.active]: activeTable })}
                >
                    {/* <div className={styles.col}>
                        <Checkbox
                            className={styles.checkbox}
                            value={chooseAll}
                            onChange={() => setСhooseAll(!chooseAll)}
                        />
                    </div> */}
                    <div className={styles.col}>Họ và tên</div>
                    <div className={styles.col}>MSSV</div>
                    {gradeComposition &&
                        gradeComposition.map((grade) => (
                            <div className={styles.col}>
                                <div className={styles.flex}>
                                    <div>{grade.name} </div>
                                    <div className={styles.dropdownBox}>
                                        <Dropdown
                                            className={styles.dropdown}
                                            setValue={setGradeOptionValue}
                                            options={gradeOptions}
                                            small
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    {user.role === "teacher" && (
                        <div className={styles.col}></div>
                    )}
                </div>
                {teachers.map((x, index) => (
                    <Row
                        item={x}
                        gradeComposition={gradeComposition}
                        onChoose={onActive}
                        key={index}
                        activeTable={activeTable}
                        setActiveTable={setActiveTable}
                        activeId={activeId}
                        setActiveId={setActiveId}
                        value={selectedFilters.includes(x.id)}
                        onChange={() => handleChange(x.id)}
                    />
                ))}
                {students.map((x, index) => (
                    <Row
                        gradeComposition={gradeComposition}
                        item={x}
                        key={index}
                        onChoose={onActive}
                        activeTable={activeTable}
                        setActiveTable={setActiveTable}
                        activeId={activeId}
                        setActiveId={setActiveId}
                        value={selectedFilters.includes(x.id)}
                        onChange={() => handleChange(x.id)}
                    />
                ))}
            </div>
            {/* <div className={styles.foot}>
                <button
                    className={cn("button-stroke button-small", styles.button)}
                >
                    <Loader className={styles.loader} />
                    <span>Load more</span>
                </button>
            </div> */}
        </div>
    );
};

export default Table;
