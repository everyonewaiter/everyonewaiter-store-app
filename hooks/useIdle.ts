import { useState } from "react";
import { Gesture } from "react-native-gesture-handler";

import { milliTimes } from "@/constants/times";
import useInterval from "@/hooks/useInterval";

const useIdle = (milliseconds: number) => {
  const [idleTime, setIdleTime] = useState(milliseconds);

  useInterval(() => {
    if (idleTime > milliTimes.ZERO) {
      setIdleTime((prev) => prev - milliTimes.ONE_SECOND);
    }
  }, milliTimes.ONE_SECOND);

  const resetIdleTime = () => {
    if (idleTime < milliseconds) {
      setIdleTime(milliseconds);
    }
  };

  const gesture = Gesture.Tap().runOnJS(true).onEnd(resetIdleTime);

  return {
    idleTime,
    resetIdleTime,
    gesture,
  };
};

export default useIdle;
