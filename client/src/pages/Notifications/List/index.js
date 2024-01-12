import React, { useState, useEffect } from "react";
import cn from "classnames";
import styles from "./List.module.sass";
import Card from "../../../components/Card";
import Dropdown from "../../../components/Dropdown";
import Actions from "../../../components/Actions";
import Loader from "../../../components/Loader";
import Item from "./Item";
import { useAuth } from "../../../hooks/useAuth";
import { ref, onValue, update } from "firebase/database";
import { database } from "../../../configs/firebase";

const intervals = ["Recent", "New", "This year"];

const List = ({ className }) => {
  const [sorting, setSorting] = useState(intervals[0]);

  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const starCountRef = ref(database, "notifications/" + user.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        data?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
      }
      setNotifications(data);
    });
  }, []);

  const handleReadNotification = (id) => {
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    // Find the noti with id
    let noti;
    for (let i = 0; i < notifications?.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (id == notifications[i].id) {
        // eslint-disable-next-line no-unused-vars
        noti = notifications[i];
        break;
      }
    }
    updates[`/notifications/${user.id}/${id}`] = {
      ...noti,
      isRead: true,
    };
    // console.log(notifications);
    // console.log(updates);
    return update(ref(database), updates);
  };

  return (
    <Card
      className={cn(styles.card, className)}
      title="Danh sách thông báo"
      classTitle={cn("title-red", styles.title)}
      classCardHead={styles.head}
      head={
        <>
          {/* <Dropdown
            className={styles.dropdown}
            classDropdownHead={styles.dropdownHead}
            value={sorting}
            setValue={setSorting}
            options={intervals}
            small
          /> */}
        </>
      }
    >
      <div className={styles.notifications}>
        <div className={styles.list}>
          {notifications &&
            notifications?.map((x, index) => (
              <Item
                className={cn(styles.item, className)}
                item={x}
                key={index}
                handleReadNotification={() => handleReadNotification(x.id)}
              />
            ))}
          {!notifications && (
            <div className={styles.text}>Bạn không có thông báo nào</div>
          )}
        </div>
        {/* <div className={styles.foot}>
          <button className={cn("button-stroke button-small", styles.button)}>
            <Loader className={styles.loader} />
            <span>Load more</span>
          </button>
        </div> */}
      </div>
    </Card>
  );
};

export default List;
