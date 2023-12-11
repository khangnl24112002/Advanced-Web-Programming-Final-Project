import React, { useState } from "react";
import cn from "classnames";
import styles from "./Overview.module.sass";
import Icon from "../../../../Icon";
import ModalPreview from "../../../../ModalPreview";

const gallery = [
    "/images/content/photo-1.jpg",
    "/images/content/photo-2.jpg",
    "/images/content/photo-1.jpg",
    "/images/content/photo-2.jpg",
];

function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
}

function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join("-");
}

const features = ["1 giáo viên", "3 học sinh", "Ngày tạo: 21/10/2023"];

const Overview = ({ item }) => {
    const [visibleModalPreview, setVisibleModalPreview] = useState(false);

    return (
        <>
            <div className={styles.overview}>
                <div className={cn("h4", styles.title)}>{item.name}</div>
                <div className={styles.info}>Mã lớp: {item.uniqueCode}</div>
                <div className={styles.line}>
                    {/* <div className={styles.rating}>
                        <Icon name="star-fill" size="24" />
                        4.8
                        <span className={styles.counter}>(87)</span>
                    </div> */}
                </div>
                {/* <div className={styles.gallery}>
          {gallery.map(
            (x, index) =>
              index < 1 && (
                <div className={styles.preview} key={index}>
                  <img src={x} alt="Product" />
                </div>
              )
          )}
          <button
            className={cn("button-white", styles.button)}
            onClick={() => setVisibleModalPreview(true)}
          >
            Show all preview
          </button>
        </div> */}
                <div className={styles.row}>
                    <div className={styles.col}>
                        <div className={cn("title-red", styles.subtitle)}>
                            Giới thiệu chung
                        </div>
                        <div className={styles.content}>
                            <p style={{ textAlign: "justify" }}>
                                {item.description}
                            </p>
                        </div>
                    </div>
                    <div className={styles.col}>
                        <div className={cn("title-purple", styles.subtitle)}>
                            Thống kê
                        </div>
                        <ul className={styles.features}>
                            <li>{item.teachers.length} giáo viên</li>
                            <li>{item.students.length} học sinh</li>
                            <li>
                                Ngày tạo: {formatDate(new Date(item.createdAt))}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <ModalPreview
                visible={visibleModalPreview}
                onClose={() => setVisibleModalPreview(false)}
                gallery={gallery}
                title="Fleet - Travel shopping UI design kit"
                figcaption="Elegant product mockup for your next project"
                download
            />
        </>
    );
};

export default Overview;
