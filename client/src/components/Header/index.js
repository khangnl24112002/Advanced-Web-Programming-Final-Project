import React, { useState } from "react";
import styles from "./Header.module.sass";

import User from "./User";

const Header = ({ onOpen }) => {
  // eslint-disable-next-line no-unused-vars
  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    onOpen();
    setVisible(false);
  };

  return (
    <header className={styles.header}>
      <button className={styles.burger} onClick={() => handleClick()}></button>

      <div className={styles.control} onClick={() => setVisible(false)}>
        <User className={styles.user} />
      </div>
    </header>
  );
};

export default Header;
