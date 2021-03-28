import React from "react";
import { drawCircle, drawStroke, getSpiral } from "shared/utils";
import { Coords } from "shared/types";
import {
  fibonacciNumsForTimer,
  fibonacciMinsToSeconds,
  fibonacciColors,
} from "shared/constants";
import styles from "./Progress.module.css";

interface Props {
  progress: number;
}

// TODO: refactor component
export const ProgressDrawer: React.FC<Props> = ({ progress }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const canvasSize = 2520; // WTF, why 2520?
  const halfSize = canvasSize / 2;

  const center = React.useMemo(() => {
    return {
      x: halfSize,
      y: halfSize,
    };
  }, [halfSize]);

  const drawStageCircles = React.useCallback(
    (ctx: CanvasRenderingContext2D, progress: number) => {
      fibonacciNumsForTimer.forEach((n, i) => {
        const second = fibonacciMinsToSeconds[i];
        const color = progress >= second ? fibonacciColors[i] : "#7772";

        drawCircle(ctx, second, center, color);
      });
    },
    [center]
  );

  const drawFibonacciProgression = React.useCallback(
    (firstPoint: Coords, secondPoint: Coords) => {
      const ctx = canvasRef?.current?.getContext("2d");

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.globalAlpha = 0.66;

      const radius = progress < canvasSize ? progress : canvasSize;
      const ancorSpiral = getSpiral(firstPoint, secondPoint, halfSize);
      const spiral = getSpiral(firstPoint, secondPoint, radius);

      drawStageCircles(ctx, progress);

      ctx.lineWidth = 8;
      ctx.lineCap = "square";
      ctx.strokeStyle = "#777";
      drawStroke(ctx, ancorSpiral, center);

      ctx.lineWidth = 16;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#fff";
      drawStroke(ctx, spiral, center);
    },
    [center, drawStageCircles, halfSize, progress]
  );

  React.useEffect(() => {
    const firstPoint = { x: 0, y: 0 };
    const secondPoint = { x: -2.17, y: -2.17 }; // rough value for nice spiral angle

    drawFibonacciProgression(firstPoint, secondPoint);
  }, [center.x, center.y, drawFibonacciProgression, progress]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className={styles.canvas}
    ></canvas>
  );
};
