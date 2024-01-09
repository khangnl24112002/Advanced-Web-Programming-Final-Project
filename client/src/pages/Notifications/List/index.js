import React, { useState } from "react";
import cn from "classnames";
import styles from "./List.module.sass";
import Card from "../../../components/Card";
import Dropdown from "../../../components/Dropdown";
import Actions from "../../../components/Actions";
import Loader from "../../../components/Loader";
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

const intervals = ["Recent", "New", "This year"];

const List = ({ className }) => {
  const [sorting, setSorting] = useState(intervals[0]);

  return (
    <Card
      className={cn(styles.card, className)}
      title="New"
      classTitle={cn("title-red", styles.title)}
      classCardHead={styles.head}
      head={
        <>
          <Dropdown
            className={styles.dropdown}
            classDropdownHead={styles.dropdownHead}
            value={sorting}
            setValue={setSorting}
            options={intervals}
            small
          />
        </>
      }
    >
      <div className={styles.notifications}>
        <div className={styles.list}>
          {notifications.map((x, index) => (
            <Item className={cn(styles.item, className)} item={x} key={index} />
          ))}
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
