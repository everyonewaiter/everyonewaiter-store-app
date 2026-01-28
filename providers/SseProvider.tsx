import { createContext, PropsWithChildren, useEffect, useRef } from "react";
import EventSource, { EventSourceListener } from "react-native-sse";

import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/keys";
import { milliTimes } from "@/constants/times";
import useInterval from "@/hooks/useInterval";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { makeSignature } from "@/utils/support";

type SseEventName = "sse";

type SseEvent = {
  storeId: string;
  category: keyof SseCategory;
  action: keyof ServerAction;
  hasData: boolean;
  data: string | null;
};

type SseCategory = {
  DEVICE: "기기";
  STORE: "매장";
  CATEGORY: "카테고리";
  MENU: "메뉴";
  WAITING: "웨이팅";
  ORDER: "주문";
  STAFF_CALL: "직원 호출";
  RECEIPT: "레시피";
  POS: "POS";
};

type ServerAction = {
  GET: "조회";
  CREATE: "생성";
  UPDATE: "수정";
  DELETE: "삭제";
};

const SseContext = createContext(null);

const SseProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const { device, secretKey } = useAuthentication();

  const isConnectedRef = useRef(false);
  const timestampRef = useRef(Date.now().toString());

  useInterval(() => {
    timestampRef.current = Date.now().toString();
  }, milliTimes.THIRTY_SECONDS);

  useEffect(() => {
    if (!device || isConnectedRef.current || !secretKey) {
      return;
    }

    const requestMethod = "GET";
    const requestURI = "/v1/stores/subscribe";
    const url = new URL(process.env.EXPO_PUBLIC_API_SERVER_URL + requestURI);

    const eventSource = new EventSource<SseEventName>(url, {
      headers: {
        "x-ew-access-key": {
          toString: () => device.deviceId,
        },
        "x-ew-signature": {
          toString: () =>
            makeSignature(
              requestMethod,
              requestURI,
              device.deviceId,
              secretKey,
              timestampRef.current
            ),
        },
        "x-ew-timestamp": {
          toString: () => timestampRef.current,
        },
      },
    });

    const listener: EventSourceListener<SseEventName> = (event) => {
      if (event.type === "open") {
        isConnectedRef.current = true;
      } else if (event.type === "close") {
        isConnectedRef.current = false;
      } else if (event.type === "sse") {
        if (!event.data || event.data === "CONNECTED!") {
          return;
        }

        const sseEvent: SseEvent = JSON.parse(event.data);
        switch (sseEvent.category) {
          case "DEVICE":
            if (
              sseEvent.data &&
              sseEvent.action !== "CREATE" &&
              sseEvent.data === device.deviceId
            ) {
              queryClient.invalidateQueries({ queryKey: [queryKeys.DEVICE] });
            }
            break;
          case "STORE":
            queryClient.invalidateQueries({ queryKey: [queryKeys.STORE] });
            break;
          case "CATEGORY":
            queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] });
            break;
          case "MENU":
            queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] });
            break;
          case "WAITING":
            queryClient.invalidateQueries({ queryKey: [queryKeys.WAITING] });
            break;
          case "ORDER":
            queryClient.invalidateQueries({ queryKey: [queryKeys.ORDER] });
            break;
          case "STAFF_CALL":
          case "RECEIPT":
          case "POS":
            break;
          default:
            throw new Error(`Unhandled store action event: ${JSON.stringify(sseEvent)}`);
        }
      }
    };

    eventSource.addEventListener("open", listener);
    eventSource.addEventListener("close", listener);
    eventSource.addEventListener("sse", listener);

    return () => {
      eventSource.removeAllEventListeners();
      eventSource.close();
    };
  }, [device, secretKey, queryClient]);

  return <SseContext.Provider value={null}>{children}</SseContext.Provider>;
};

export default SseProvider;
