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
import { useAuth } from "../../../hooks/useAuth";

const MarkAssignmentModal = ({
    visible,
    onClose,
    assignmentDetail,
    review,
    alreadySubmit,
}) => {
    useEffect(() => {
        console.log(review);
    }, []);
    const { assignmentId } = useParams();
    const { user } = useAuth();
    const escFunction = useCallback(
        (e) => {
            if (e.keyCode === 27) {
                onClose();
            }
        },
        [onClose]
    );
    const [messageData, setMessageData] = useState([]);
    const onSubmitMessage = async (data) => {
        try {
            console.log("review : ", review);
            const response = await assignmentServices.sendMessage(
                assignmentId,
                review.studentRequestedReviewId,
                data.reviewContent
            );
            if (response.status) {
                window.location.reload();
                return successToast("Đã gửi tin nhắn", 2000);
            } else {
                return errorToast("Không gửi được. Vui lòng thử lại sau.");
            }
        } catch (error) {
            return errorToast("Không gửi được. Vui lòng thử lại sau");
        }
    };
    const { control, setValue, handleSubmit, reset } = useForm();
    const {
        control: controlAssignmentInfo,
        handleSubmit: handleSubmitAssignmentInfo,
    } = useForm();

    // Lấy nội dung tin nhắn
    useEffect(() => {
        const getMessageList = async () => {
            if (!review) {
                return;
            }
            const studentRequestedReviewId = review.studentRequestedReviewId;
            try {
                const response = await assignmentServices.getMessageList(
                    studentRequestedReviewId
                );
                if (response.status) {
                    setMessageData(response.data);
                } else {
                    return errorToast(
                        "Không lấy được tin nhắn. Vui lòng thử lại sau."
                    );
                }
            } catch (error) {
                return errorToast(
                    "Không lấy được tin nhắn. Vui lòng thử lại sau."
                );
            }
        };
        getMessageList();
    }, []);
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
                                    {review && (
                                        <>
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
                                                        Phúc khảo
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.messagebox
                                                        }
                                                    >
                                                        {messageData.length &&
                                                            messageData.map(
                                                                (
                                                                    message,
                                                                    index
                                                                ) => {
                                                                    if (
                                                                        message.userId !==
                                                                        user?.id
                                                                    ) {
                                                                        return (
                                                                            <div
                                                                                className={
                                                                                    styles.another_message
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className={
                                                                                        styles.name
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        message.user
                                                                                    }
                                                                                </div>
                                                                                <div
                                                                                    className={
                                                                                        styles.content
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        message.message
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <div
                                                                                className={
                                                                                    styles.your_message
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className={
                                                                                        styles.name
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        message.user
                                                                                    }
                                                                                </div>
                                                                                <div
                                                                                    className={
                                                                                        styles.content
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        message.message
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                    </div>
                                                    <form
                                                        onSubmit={handleSubmitReview(
                                                            onSubmitMessage
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
                                                                    onChange={
                                                                        onChange
                                                                    }
                                                                    onBlur={
                                                                        onBlur
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
                                                                />
                                                            )}
                                                            name="reviewContent"
                                                            control={
                                                                reviewControl
                                                            }
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
                                                {!review && (
                                                    <>
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
                                                                    onChange={
                                                                        onChange
                                                                    }
                                                                    onBlur={
                                                                        onBlur
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
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
                                                    </>
                                                )}
                                                {review && (
                                                    <div>
                                                        Bạn đã gửi phúc khảo
                                                        điểm
                                                    </div>
                                                )}
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
