import { RefObject, useMemo, useRef } from "react";
import { Gesture } from "react-native-gesture-handler";

import { milliTimes } from "@/constants/times";
import useInterval from "@/hooks/useInterval";

// ref에 접근하는 함수를 렌더 중 다른 함수에 넘기면 React Compiler가 refs 규칙 위반으로 보고하고 useIdle을 컴파일하지 않는다.
// Gesture.onEnd()는 callback을 저장만 하고 렌더 중 호출하지 않으므로 ref에 접근하는 함수를 별도 hook에서 만든다.
const useResetIdleTime = (idleTimeRef: RefObject<number>, milliseconds: number) => {
  return () => {
    if (idleTimeRef.current < milliseconds) {
      idleTimeRef.current = milliseconds;
    }
  };
};

const useIdle = (milliseconds: number) => {
  const idleTimeRef = useRef(milliseconds);

  useInterval(() => {
    if (idleTimeRef.current > milliTimes.ZERO) {
      idleTimeRef.current -= milliTimes.ONE_SECOND;
    }
  }, milliTimes.ONE_SECOND);

  const resetIdleTime = useResetIdleTime(idleTimeRef, milliseconds);

  const gesture = useMemo(() => Gesture.Tap().runOnJS(true).onEnd(resetIdleTime), [resetIdleTime]);

  return {
    idleTime: idleTimeRef,
    resetIdleTime,
    gesture,
  };
};

export default useIdle;
