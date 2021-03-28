import React from "react";
import styles from "./TimerButton.module.css";

type Props = {
  isTimerStarted: boolean;
  handleTimerClick: () => void;
};

export const TimerButton: React.FC<Props> = ({
  isTimerStarted = false,
  handleTimerClick,
}) => {
  const buttonText = isTimerStarted ? "End" : "Start";
  const buttonClassNames = `${styles["timer-button"]} ${
    isTimerStarted ? styles["timer-button-started"] : null
  }`;

  return (
    <button
      className={buttonClassNames}
      type="button"
      onClick={handleTimerClick}
    >
      {buttonText}
    </button>
  );
};
