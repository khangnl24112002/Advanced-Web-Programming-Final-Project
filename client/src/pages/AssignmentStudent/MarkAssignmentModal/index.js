import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import cn from "classnames";
import { createPortal } from "react-dom";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import styles from "./MarkAssignmentModal.module.sass";
import Icon from "../../../components/Icon";
import Card from "../../../components/Card";
import LargeInput from "../../../components/LargeInput";
import TextInput from "../../../components/TextInput";
import { useForm, Controller } from "react-hook-form";
import { errorToast, successToast } from "../../../utils/toast";
import { assignmentServices } from "../../../services/AssignmentServices";

const MarkAssignmentModal = ({
    visible,
    onClose,
    assignmentDetail,
    reviews,
    alreadySubmit,
}) => {
    const { assignmentId } = useParams();
    const escFunction = useCallback(
        (e) => {
            if (e.keyCode === 27) {
                onClose();
            }
        },
        [onClose]
    );

    const { control, setValue, handleSubmit, reset } = useForm();
    const {
        control: controlAssignmentInfo,
        handleSubmit: handleSubmitAssignmentInfo,
    } = useForm();
    const onSubmit = async (data) => {
        const score = parseFloat(data.score);

        if (score < 0 || score > 10) {
            return errorToast("Số điểm không hợp lệ!");
        } else {
            const requestObject = {
                studentAssignmentId: parseInt(assignmentDetail.id),
                expectedScore: parseInt(data.score),
                comment: "Phúc khảo điểm",
            };
            console.log(requestObject);
            const response = await assignmentServices.postAssignmentReview(
                assignmentId,
                requestObject
            );
            if (response.status) {
                onClose();
                return successToast("Gửi điểm muốn phúc khảo thành công");
            } else {
                return errorToast("Gửi điểm muốn phúc khảo thất bại!");
            }
        }
    };
    const onUpdateAssignmentInfo = async (data) => {
        let fileUrl;
        let studentDescription = data.description;
        // Call API to upload file (if file exists)
        if (data?.file) {
            const uploadFileResponse = await assignmentServices.uploadFile(
                data.file
            );
            if (uploadFileResponse.status) {
                fileUrl = uploadFileResponse.data.url;
            } else {
                fileUrl = undefined;
            }
        }

        // Create request object
        const requestObject = {
            metadata: undefined,
            description: "Không có",
        };
        if (fileUrl !== undefined) {
            requestObject.metadata = fileUrl;
        }
        if (studentDescription !== "") {
            requestObject.description = studentDescription;
        }
        // Call API to update assignment info
        const response = await assignmentServices.studentSubmitAssignment(
            assignmentId,
            requestObject
        );
        if (response.status) {
            successToast("Nộp bài thành công!", 2000);
            window.location.reload();
        } else {
            return errorToast("Nộp bài thất bại");
        }
    };
    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    useEffect(() => {
        if (visible) {
            const target = document.querySelector("#modal-product");
            disableBodyScroll(target);
        } else {
            clearAllBodyScrollLocks();
        }
    }, [visible]);

    const { control: reviewControl, handleSubmit: handleSubmitReview } =
        useForm();

    const onSubmitReview = (data) => {
        console.log(data);
    };
    return createPortal(
        visible && (
            <div id="modal-product" className={styles.modal}>
                <div className={styles.control}>
                    <div className={cn("button-white", styles.button)}>
                        Bài nộp
                    </div>
                    <button className={styles.close} onClick={onClose}>
                        <Icon name="close" size="20" />
                    </button>
                </div>
                <div className={styles.outer}>
                    <Card className={cn(styles.card)}>
                        <div style={{ display: "flex", gap: "40px" }}>
                            {!alreadySubmit && (
                                <div
                                    style={{ flex: 2 }}
                                    className={cn(styles.head)}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "title-green",
                                                styles.title
                                            )}
                                        >
                                            Bài nộp
                                        </div>

                                        <div>File bài nộp</div>
                                        <form
                                            onSubmit={handleSubmitAssignmentInfo(
                                                onUpdateAssignmentInfo
                                            )}
                                            className={styles.description}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            <Controller
                                                render={({
                                                    field: {
                                                        onChange,
                                                        onBlur,
                                                        value,
                                                    },
                                                }) => (
                                                    <TextInput
                                                        className={styles.field}
                                                        label=""
                                                        type="file"
                                                        onChange={(event) => {
                                                            onChange(
                                                                event.target
                                                                    .files[0]
                                                            );
                                                        }}
                                                        onBlur={onBlur}
                                                        value={value?.fileName}
                                                    />
                                                )}
                                                name="file"
                                                control={controlAssignmentInfo}
                                            />
                                            <Controller
                                                render={({
                                                    field: {
                                                        onChange,
                                                        onBlur,
                                                        value,
                                                    },
                                                }) => (
                                                    <LargeInput
                                                        className={styles.field}
                                                        label="Mô tả bài tập"
                                                        type="text"
                                                        required
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value}
                                                    />
                                                )}
                                                name="description"
                                                control={controlAssignmentInfo}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <button
                                                    className={cn(
                                                        "button",
                                                        styles.button
                                                    )}
                                                    style={{
                                                        marginTop: "20px",
                                                        marginLeft: "20px",
                                                    }}
                                                    type="submit"
                                                >
                                                    Cập nhật
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                            {alreadySubmit && (
                                <>
                                    <div
                                        style={{ flex: 1 }}
                                        className={cn(styles.head)}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    "title-green",
                                                    styles.title
                                                )}
                                            >
                                                Phúc khảo điểm
                                            </div>
                                            <form
                                                onSubmit={handleSubmit(
                                                    onSubmit
                                                )}
                                            >
                                                <Controller
                                                    render={({
                                                        field: {
                                                            onChange,
                                                            onBlur,
                                                            value,
                                                        },
                                                    }) => (
                                                        <TextInput
                                                            className={
                                                                styles.field
                                                            }
                                                            label="Số điểm mong đợi"
                                                            type="number"
                                                            required
                                                            onChange={onChange}
                                                            onBlur={onBlur}
                                                            value={value}
                                                        />
                                                    )}
                                                    name="score"
                                                    control={control}
                                                />
                                                <button
                                                    className={cn(
                                                        "button",
                                                        styles.button
                                                    )}
                                                    style={{}}
                                                    type="submit"
                                                >
                                                    Gửi điểm
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div
                                        style={{ flex: 1 }}
                                        className={cn(styles.head)}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    "title-green",
                                                    styles.title
                                                )}
                                            >
                                                Phúc khảo
                                            </div>
                                            <div className={styles.messagebox}>
                                                <div
                                                    className={
                                                        styles.your_message
                                                    }
                                                >
                                                    <div
                                                        className={styles.name}
                                                    >
                                                        khagnnl2412@gmail.com
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.content
                                                        }
                                                    >
                                                        Phúc khảo giúp em
                                                    </div>
                                                </div>
                                                <div
                                                    className={
                                                        styles.another_message
                                                    }
                                                >
                                                    <div
                                                        className={styles.name}
                                                    >
                                                        Bạn
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.content
                                                        }
                                                    >
                                                        Phúc cc
                                                    </div>
                                                </div>
                                            </div>
                                            <form
                                                onSubmit={handleSubmitReview(
                                                    onSubmitReview
                                                )}
                                            >
                                                <Controller
                                                    render={({
                                                        field: {
                                                            onChange,
                                                            onBlur,
                                                            value,
                                                        },
                                                    }) => (
                                                        <TextInput
                                                            className={
                                                                styles.field
                                                            }
                                                            label="Nội dung phản hồi"
                                                            type="text"
                                                            required
                                                            onChange={onChange}
                                                            onBlur={onBlur}
                                                            value={value}
                                                        />
                                                    )}
                                                    name="reviewContent"
                                                    control={reviewControl}
                                                />
                                                <button
                                                    className={cn(
                                                        "button",
                                                        styles.button
                                                    )}
                                                    style={{}}
                                                    type="submit"
                                                >
                                                    Gửi
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        ),
        document.body
    );
};

export default MarkAssignmentModal;
