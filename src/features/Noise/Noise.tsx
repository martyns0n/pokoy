import React from "react";
import styles from "./Noise.module.css";

interface Props {
  isTimerStarted: boolean;
}

// TODO: refactor component
export const Noise: React.FC<Props> = ({ isTimerStarted }) => {
  const [gain, setGain] = React.useState<any>(null);
  const audioCtx = React.useMemo(() => {
    // @ts-expect-error in case of Safari audio context support
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
  }, []);

  const generateBrownNoise = React.useCallback((audioCtx) => {
    // ! code from internet
    const bufferSize = 4096;
    const processorNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);

    processorNode.onaudioprocess = (e: any) => {
      const output = e.outputBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;

        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];

        output[i] *= 3.5; // (roughly) compensate for gain
      }
    };

    return processorNode;
  }, []);

  const handleVolumeChange = React.useCallback(
    (e) => {
      console.log("🚀 ~ handleVolumeChange ~ e", e);
      const newGain = Number(e.target.value);

      gain.value = newGain;
    },
    [gain]
  );

  React.useEffect(() => {
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 3; // dafault volume value
    setGain(gainNode.gain);

    const brownNoise = generateBrownNoise(audioCtx);
    brownNoise.connect(gainNode);
  }, [audioCtx, generateBrownNoise]);

  const turnOnNoise = React.useCallback(() => {
    audioCtx.resume();
  }, [audioCtx]);

  const turnOffNoise = React.useCallback(() => {
    audioCtx.suspend();
  }, [audioCtx]);

  React.useEffect(() => {
    if (isTimerStarted) {
      turnOnNoise();
    } else {
      turnOffNoise();
    }
  }, [isTimerStarted, turnOffNoise, turnOnNoise]);

  return (
    <label className={styles["volume-control"]}>
      Громкость
      <input
        onChange={handleVolumeChange}
        value={gain?.value || 0}
        className={styles["slider"]}
        type="range"
        min="0"
        max="10"
      />
    </label>
  );
};
