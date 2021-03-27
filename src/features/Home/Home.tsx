import React from "react";
import {
  FibonacciProgress,
  Header,
  TimerButton,
  Countdown,
  Noise,
  Stats,
} from "features";
import { getFibonacciDiscrete } from "shared/utils";
import styles from "./Home.module.css";
import { StatsData } from "shared/types";

// TODO: refactor this component
export const Home: React.FC = () => {
  const [timestamp, setTimestamp] = React.useState(0);
  const [timerDiff, setTimerDiff] = React.useState(0);
  const [isStarted, setStartedFlag] = React.useState(false);
  const [currentTimerId, setCurrentTimerId] = React.useState<
    number | undefined
  >(undefined);

  React.useEffect(() => {
    if (timestamp !== 0) {
      const timeDiff = Math.round(Date.now() / 1000 - timestamp);
      setTimerDiff(timeDiff);
    }

    return () => {
      clearTimeout(currentTimerId);
    };
  }, [currentTimerId, timestamp]);

  const tickTimer = React.useCallback(() => {
    const timerId = window.setTimeout(() => {
      tickTimer();
    }, 100);

    setCurrentTimerId(timerId);
  }, []);

  const writeSessionToStore = React.useCallback((seconds) => {
    const dateObj = new Date();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const date = `${year}-${month}-${day}`;

    const totalTime = getFibonacciDiscrete(seconds / 60);

    const dataString = localStorage.getItem("stats") ?? "{}";
    const statsData: StatsData = JSON.parse(dataString);
    const item = statsData[date] || [];
    const newItem = [...item, totalTime];
    const newData = { ...statsData, [date]: newItem };

    const newDataString = JSON.stringify(newData);
    localStorage.setItem("stats", newDataString);
  }, []);

  const handleTimerClick = React.useCallback(() => {
    setTimerDiff(0);

    if (isStarted) {
      writeSessionToStore(timerDiff);

      setStartedFlag(false);
      setTimestamp(0);

      window.clearTimeout(currentTimerId);
      console.log("Timer resetted");

      return;
    }

    setStartedFlag(true);

    setTimestamp(Math.round(Date.now() / 1000));
    tickTimer();
  }, [currentTimerId, isStarted, tickTimer, timerDiff, writeSessionToStore]);

  const sessionsData = JSON.parse(localStorage.getItem("stats") ?? "[]");

  return (
    <main className={styles["app-wrapper"]}>
      <Header />
      <Stats sessionsData={sessionsData} />
      <Noise isTimerStarted={isStarted} />
      <TimerButton
        handleTimerClick={handleTimerClick}
        isTimerStarted={isStarted}
      />
      <FibonacciProgress value={timerDiff} />
      <Countdown seconds={timerDiff} />
    </main>
  );
};
