import { getFibonacciDiscrete } from "shared/utils";
import { StatsData } from "shared/types";

export const writeSessionToStore = (seconds: number) => {
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
};
