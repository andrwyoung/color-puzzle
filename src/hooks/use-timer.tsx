import { useState, useRef, useEffect } from "react";

export function useTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (intervalRef.current !== null) return; // already running

    intervalRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  };

  // resets timer to 0 and then starts it again
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsedSeconds(0);
    startTimer(); // starts again immediaetly
  };

  // cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // formats the time into mm:ss string
  const getFormattedTime = () => {
    if (intervalRef.current === null && elapsedSeconds === 0) {
      return "-:--";
    }

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    elapsedSeconds,
    getFormattedTime,
    startTimer,
    resetTimer
  };
}
