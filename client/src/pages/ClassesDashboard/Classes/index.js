import React, { useState } from "react";
import styles from "./Classes.module.sass";
import cn from "classnames";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Dropdown from "../../../components/Dropdown";
import Market from "./Market";
import Table from "./Table";
import { Link } from "react-router-dom";
// data
import { traffic } from "../../../mocks/traffic";
import { viewers } from "../../../mocks/viewers";
import { market } from "../../../mocks/market";
import Icon from "../../../components/Icon";
const indicatorsTraffic = [
  {
    title: "Market",
    color: "#FFBC99",
  },
  {
    title: "Social media",
    color: "#CABDFF",
  },
  {
    title: "Direct",
    color: "#B5E4CA",
  },
  {
    title: "UI8",
    color: "#B1E5FC",
  },
  {
    title: "Others",
    color: "#FFD88D",
  },
];

const indicatorsViewers = [
  {
    title: "Followers",
    color: "#B5E4CA",
  },
  {
    title: "Others",
    color: "#CABDFF",
  },
];

const Classes = () => {
  const navigation = ["Market", "Traffic sources", "Viewers"];

  const [activeTab, setActiveTab] = useState(navigation[0]);
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    alert();
  };

  return (
    <Card
      className={styles.card}
      title="Danh sách các lớp học"
      classTitle={cn("title-purple", styles.title)}
      classCardHead={styles.head}
      head={
        <>
          <Form
            className={styles.form}
            value={search}
            setValue={setSearch}
            onSubmit={() => handleSubmit()}
            placeholder="Tìm lớp"
            type="text"
            name="search"
            icon="search"
          />
          {/**Button dùng để tạo lớp học */}
          <Link className={cn("button-small", styles.button)} to="addClass">
            <Icon name="add" size="20" />
            <span>Tạo lớp</span>
          </Link>

          {/* <div className={styles.control}>
            <button className={cn("button-stroke button-small", styles.button)}>
              Deleted
            </button>
            <button className={cn("button-stroke button-small", styles.button)}>
              Set status
            </button>
            <div className={styles.counter}>3 selected</div>
          </div> */}
          {/* <div className={cn(styles.nav, "tablet-hide")}>
                        {navigation.map((x, index) => (
                            <button
                                className={cn(styles.link, {
                                    [styles.active]: x === activeTab,
                                })}
                                onClick={() => setActiveTab(x)}
                                key={index}
                            >
                                {x}
                            </button>
                        ))}
                    </div> */}
          {/* <div className={cn(styles.dropdown, "tablet-show")}>
            <Dropdown
              classDropdownHead={styles.dropdownHead}
              value={activeTab}
              setValue={setActiveTab}
              options={navigation}
              small
            />
          </div> */}
        </>
      }
    >
      <div className={styles.classes}>
        <div className={styles.wrapper}>
          {activeTab === navigation[0] && <Market items={market} />}
          {activeTab === navigation[1] && (
            <Table
              title="Traffic source"
              items={traffic}
              legend={indicatorsTraffic}
            />
          )}
          {activeTab === navigation[2] && (
            <Table title="Viewers" items={viewers} legend={indicatorsViewers} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Classes;
