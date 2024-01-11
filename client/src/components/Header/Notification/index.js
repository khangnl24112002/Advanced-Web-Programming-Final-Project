import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./Notification.module.sass";
import Icon from "../../Icon";
import Item from "./Item";
import { ref, onValue } from "firebase/database";
import { database } from "../../../configs/firebase";
import { useAuth } from "../../../hooks/useAuth";

const Notification = ({ className }) => {
  // Quản lý lấy thông báo

  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [existNotRead, setExistNotRead] = useState(false);

  useEffect(() => {
    const starCountRef = ref(database, "notifications/" + user.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      data.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
      setNotifications(data);
      for (let i = 0; i < notifications?.length; i++) {
        if (notifications[i]?.isRead === false) {
          setExistNotRead(true);
          return;
        }
        setExistNotRead(false);
      }
    });
  }, []);

  const [visible, setVisible] = useState(false);

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div
        className={cn(styles.notification, className, {
          [styles.active]: visible,
        })}
      >
        <button
          className={
            existNotRead ? cn(styles.head, styles.active) : cn(styles.head)
          }
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
            {notifications ? (
              notifications.map((x, index) => {
                if (index < 4) {
                  return (
                    <Item
                      className={cn(styles.item, className)}
                      item={x}
                      key={index}
                      onClose={() => setVisible(false)}
                    />
                  );
                }
              })
            ) : (
              <div style={{ padding: "12px" }} className={styles.text}>
                Bạn không có thông báo nào
              </div>
            )}
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
