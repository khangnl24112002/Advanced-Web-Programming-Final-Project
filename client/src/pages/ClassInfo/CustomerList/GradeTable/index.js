import React, { useState, useRef } from "react";
import styles from "./GradeTable.module.sass";
import cn from "classnames";
import Checkbox from "../../../../components/Checkbox";
import { errorToast, successToast } from "../../../../utils/toast";
import Loader from "../../../../components/Loader";
import TextInput from "../../../../components/TextInput";
import Row from "./Row";
import Dropdown from "./Dropdown";
import { useAuth } from "../../../../hooks/useAuth";
import Modal from "../Modal";
import { classServices } from "../../../../services/ClassServices";

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
    const inputRef = useRef(null);

    const [chooseAll, setСhooseAll] = useState(false);
    const [activeId, setActiveId] = useState(customers[0].id);
    const [gradeOptionValue, setGradeOptionValue] = useState("...");
    const [selectedFilters, setSelectedFilters] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [content, setContent] = useState(null);

    const validateGrade = (grade) => {
        let result = 1;
        if (grade < 0 || grade > 10) {
            return errorToast(
                "Điểm nhập vào phải lớn hơn hoặc bằng 0 và bé hơn hoặc bằng 10"
            );
        }
        return result;
    };
    const handleChangeGrade = async (gradeId, userId) => {
        const grade = inputRef.current.value;
        if (validateGrade(grade) === 1) {
            // 2. Gọi API để kiểm tra xem email có tồn tại hay không
            const response = await classServices.updateAssignmentGrade(
                gradeId,
                {
                    scores: [
                        {
                            studentId: userId,
                            score: grade,
                        },
                    ],
                }
            );
            if (response.status) {
                return successToast("Đã cập nhật điểm", 2000);
            } else {
                return errorToast("Đã xảy ra lỗi, xin vui lòng thử lại!");
            }
        }
    };
    const handleEditGrade = (grade, userId) => {
        setOpenModal(true);
        console.log(grade, userId);
        setContent(
            <>
                <div className={cn("title-green", styles.modaltitle)}>
                    Sửa điểm
                </div>
                <div className={styles.info}>Sửa điểm cho sinh viên</div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        gap: "10px",
                    }}
                >
                    <TextInput
                        className={styles.field}
                        label={grade.name + " ( " + grade.percentage + " %) "}
                        name="score"
                        type="number"
                        min="0"
                        max="10"
                        required
                        innerRef={inputRef}
                    />

                    <button
                        className={cn("button-stroke", styles.button)}
                        onClick={() => {
                            handleChangeGrade(grade.id, userId);
                        }}
                    >
                        <span>Sửa</span>
                    </button>
                </div>
                <div className={styles.foot}>
                    <button
                        className={cn("button-stroke", styles.button)}
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        <span>Quay lại</span>
                    </button>
                </div>
            </>
        );
    };

    const handleChange = (id) => {
        if (selectedFilters.includes(id)) {
            setSelectedFilters(selectedFilters.filter((x) => x !== id));
        } else {
            setSelectedFilters((selectedFilters) => [...selectedFilters, id]);
        }
    };

    const handleClickAssignmentOptions = (option) => {
        console.log(option);
    };
    return (
        <>
            <Modal
                outerClassName={styles.outer}
                visible={openModal}
                onClose={() => setOpenModal(false)}
            >
                {content}
            </Modal>
            <div className={cn(styles.wrapper, className)}>
                <div className={cn(styles.table)}>
                    <div
                        className={cn(styles.row, {
                            [styles.active]: activeTable,
                        })}
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
                            gradeComposition.map((grade, index) => (
                                <div className={styles.col} key={index}>
                                    <div className={styles.flex}>
                                        <div>{grade.name} </div>
                                        <div className={styles.dropdownBox}>
                                            <Dropdown
                                                className={styles.dropdown}
                                                setValue={setGradeOptionValue}
                                                options={gradeOptions}
                                                chooseOption={(option) => {
                                                    handleClickAssignmentOptions(
                                                        option
                                                    );
                                                }}
                                                small
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {students.map((x, index) => (
                        <Row
                            gradeComposition={gradeComposition}
                            item={x}
                            key={index}
                            onChoose={onActive}
                            editGrade={(grade, userId) => {
                                handleEditGrade(grade, userId);
                            }}
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
        </>
    );
};

export default Table;
