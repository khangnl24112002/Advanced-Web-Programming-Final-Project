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

const features = ["1 giáo viên", "3 học sinh", "Ngày tạo: 21/10/2023"];

const Overview = () => {
    const [visibleModalPreview, setVisibleModalPreview] = useState(false);

    return (
        <>
            <div className={styles.overview}>
                <div className={cn("h4", styles.title)}>
                    Toán ứng dụng và thống kê
                </div>
                <div className={styles.info}>Mã lớp: 20_1</div>
                <div className={styles.line}>
                    <div className={styles.author}>
                        <div className={styles.avatar}>
                            <img src="/assets/male-avatar.jpg" alt="Avatar" />
                        </div>
                        by <span>Nguyễn Hữu Toàn</span>
                    </div>
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
                                Lớp học toán mang đến một trải nghiệm đa dạng và
                                thú vị cho học sinh, khám phá nhiều khía cạnh
                                của môn toán thông qua các bài giảng sáng tạo và
                                các hoạt động thực hành. Giáo viên tập trung vào
                                việc khuyến khích sự hiểu biết sâu rộng hơn thay
                                vì chỉ việc nhớ các kiến thức cụ thể. Các chủ đề
                                được chọn một cách ngẫu nhiên nhằm kích thích tò
                                mò và sự sáng tạo, giúp học sinh xây dựng kỹ
                                năng tư duy logic và giải quyết vấn đề. Qua lớp
                                học này, học sinh được khích lệ tự tin, linh
                                hoạt và có khả năng áp dụng kiến thức toán học
                                vào thực tế.
                            </p>
                        </div>
                    </div>
                    <div className={styles.col}>
                        <div className={cn("title-purple", styles.subtitle)}>
                            Thống kê
                        </div>
                        <ul className={styles.features}>
                            {features.map((x, index) => (
                                <li key={index}>{x}</li>
                            ))}
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
