import React, { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./Notification.module.sass";
import Icon from "../../Icon";
import Actions from "../../Actions";
import Item from "./Item";

// data
const notifications = [
  {
    content: "This is a notification content",
    createdAt: "2023-12-31T11:09:53.417Z",
    id: 0,
    isRead: true,
    title: "This is notification title",
    type: "notification",
  },
  {
    content: "This is a notification content",
    createdAt: "2023-12-31T11:09:53.417Z",
    id: 1,
    isRead: false,
    title: "This is notification title",
    type: "notification",
  },
];

const Notification = ({ className }) => {
  const [visible, setVisible] = useState(false);

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div
        className={cn(styles.notification, className, {
          [styles.active]: visible,
        })}
      >
        <button
          className={cn(styles.head, styles.active)}
          onClick={() => setVisible(!visible)}
        >
          <Icon name="notification" size="24" />
        </button>
        <div className={styles.body}>
          <div className={styles.top}>
            <div className={styles.title}>Thông báo</div>
            {/* <Actions
              className={styles.actions}
              classActionsHead={styles.actionsHead}
              items={actions}
              small
            /> */}
          </div>
          <div className={styles.list}>
            {notifications.map((x, index) => (
              <Item
                className={cn(styles.item, className)}
                item={x}
                key={index}
                onClose={() => setVisible(false)}
              />
            ))}
          </div>
          <Link
            className={cn("button", styles.button)}
            to="/notifications"
            onClick={() => setVisible(false)}
          >
            Xem toàn bộ thông báo
          </Link>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Notification;
