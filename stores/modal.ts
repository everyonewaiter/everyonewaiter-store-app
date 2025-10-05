import { create } from "zustand";

import { CartModalProps } from "@/components/Modal/CartModal";
import { CountryOfOriginModalProps } from "@/components/Modal/CountryOfOriginModal";
import { ErrorModalProps } from "@/components/Modal/ErrorModal";
import { MenuModalProps } from "@/components/Modal/MenuModal";
import { OrderHistoryModalProps } from "@/components/Modal/OrderHistoryModal";
import { StaffCallModalProps } from "@/components/Modal/StaffCallModal";
import { SubmitModalProps } from "@/components/Modal/SubmitModal";
import { SuccessModalProps } from "@/components/Modal/SuccessModal";
import { ValueOf } from "@/types/utility";

export const ModalName = {
  CART: "cart",
  CART_RESET: "cartReset",
  COUNTRY_OF_ORIGIN: "countryOfOrigin",
  DEVICE_CREATE_ERROR: "deviceCreateError",
  KSNET_DEVICE_NO_NOT_INITIALIZED: "ksnetDeviceNoNotInitialized",
  KSNET_PAYMENT_ERROR: "paymentError",
  MENU: "menu",
  ORDER_SUCCESS: "orderSuccess",
  ORDER_ERROR: "orderError",
  ORDER_HISTORY: "orderHistory",
  ORDER_PAYMENT_ERROR: "orderPaymentError",
  STAFF_CALL: "staffCall",
  STAFF_CALL_SUCCESS: "staffCallSuccess",
  STAFF_CALL_ERROR: "staffCallError",
  STORE_IS_EMPTY: "storeIsEmpty",
  WAITING_REGISTRATION_SUBMIT: "waitingRegistrationSubmit",
  WAITING_REGISTRATION_SUCCESS: "waitingRegistrationSuccess",
  WAITING_REGISTRATION_ERROR: "waitingRegistrationError",
} as const;

type ModalNameValue = ValueOf<typeof ModalName>;

type ModalProps =
  | CartModalProps
  | CountryOfOriginModalProps
  | ErrorModalProps
  | MenuModalProps
  | OrderHistoryModalProps
  | StaffCallModalProps
  | SubmitModalProps
  | SuccessModalProps;

interface Modal<P = ModalProps> {
  name: ModalNameValue;
  ModalComponent: React.FC<P>;
  props: P;
}

interface ModalStore {
  modals: Modal[];
  isOpenModal: boolean;
  openModal: <P extends ModalProps>(
    name: ModalNameValue,
    ModalComponent: React.FC<P>,
    props: P
  ) => void;
  closeModal: () => void;
  closeAllModals: () => void;
}

const useModalStore = create<ModalStore>((set, get) => ({
  modals: [],
  isOpenModal: get().modals.length > 0,
  openModal: <P extends ModalProps>(name: ModalNameValue, ModalComponent: React.FC<P>, props: P) =>
    set((state) => ({
      modals: [
        ...state.modals.filter((modal) => modal.name !== name),
        { name, ModalComponent, props } as Modal,
      ],
    })),
  closeModal: () =>
    set((state) => ({
      modals: state.modals.slice(0, -1),
    })),
  closeAllModals: () => set({ modals: [] }),
}));

export default useModalStore;
