import { useRef } from "react";
import { Gesture } from "react-native-gesture-handler";

import { milliTimes } from "@/constants/times";
import useInterval from "@/hooks/useInterval";

const useIdle = (milliseconds: number) => {
  const idleTimeRef = useRef(milliseconds);

  useInterval(() => {
    if (idleTimeRef.current > milliTimes.ZERO) {
      idleTimeRef.current -= milliTimes.ONE_SECOND;
    }
  }, milliTimes.ONE_SECOND);

  const resetIdleTime = () => {
    if (idleTimeRef.current < milliseconds) {
      idleTimeRef.current = milliseconds;
    }
  };

  const gesture = Gesture.Tap().runOnJS(true).onEnd(resetIdleTime);

  return {
    idleTime: idleTimeRef,
    resetIdleTime,
    gesture,
  };
};

export default useIdle;
