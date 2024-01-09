import React, { useState } from "react";
import cn from "classnames";
import styles from "./Item.module.sass";
import Control from "./Control";
import dayjs from "dayjs";
const Item = ({ className, item }) => {
  const [visible, setVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState("");

  return (
    <div className={cn(styles.item, { [styles.new]: !item.isRead }, className)}>
      {/* <div className={styles.avatar}>
        <img src="" alt="Avatar" />
        <div className={styles.icon} style={{ backgroundColor: item.color }}>
          <img src={item.icon} alt="Status" />
        </div>
      </div> */}
      <div className={styles.details}>
        <div className={styles.line}>
          <div className={styles.subtitle}>{item.title}</div>
          <div className={styles.login}></div>
          <div className={styles.time}>
            {dayjs(item.createdAt).format("DD/MM/YYYY")}
          </div>
        </div>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: item.content }}
        ></div>

        <Control
          className={styles.control}
          value={visible}
          setValue={setVisible}
          valueAnswer={currentValue}
          setValueAnswer={setCurrentValue}
        />
      </div>
    </div>
  );
};

export default Item;
