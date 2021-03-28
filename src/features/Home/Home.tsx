import React from "react";
import {
  FibonacciProgress,
  Header,
  TimerButton,
  Countdown,
  // Noise,
  // Stats,
} from "features";
import styles from "./Home.module.css";
// import { writeSessionToStore } from "./writeSessionToStore"

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

  const handleTimerClick = React.useCallback(() => {
    setTimerDiff(0);

    if (isStarted) {
      // writeSessionToStore(timerDiff);

      setStartedFlag(false);
      setTimestamp(0);

      window.clearTimeout(currentTimerId);
      console.log("Timer resetted");

      return;
    }

    setStartedFlag(true);

    setTimestamp(Math.round(Date.now() / 1000));
    tickTimer();
  }, [currentTimerId, isStarted, tickTimer]);

  // const sessionsData = JSON.parse(localStorage.getItem("stats") ?? "[]");

  return (
    <main className={styles["app-wrapper"]}>
      {/* <Header /> */}
      <p>
        <TimerButton
          handleTimerClick={handleTimerClick}
          isTimerStarted={isStarted}
        />
        <p>
          <Countdown seconds={timerDiff} />
        </p>
      </p>
      <div className={styles["progress-spiral-wrapper"]}>
        <FibonacciProgress value={timerDiff} />
      </div>
      {/* <Stats sessionsData={sessionsData} /> */}
      {/* <Noise isTimerStarted={isStarted}/> */}
    </main>
  );
};
