import { create } from "zustand";

import { CartModalProps } from "@/components/Modal/CartModal";
import { CountryOfOriginModalProps } from "@/components/Modal/CountryOfOriginModal";
import { ErrorModalProps } from "@/components/Modal/ErrorModal";
import { MenuModalProps } from "@/components/Modal/MenuModal";
import { OrderHistoryModalProps } from "@/components/Modal/OrderHistoryModal";
import { StaffCallModalProps } from "@/components/Modal/StaffCallModal";
import { SuccessModalProps } from "@/components/Modal/SuccessModal";
import { ValueOf } from "@/types/utility";

export const ModalName = {
  STORE_IS_EMPTY: "storeIsEmpty",
} as const;

type ModalNameValue = ValueOf<typeof ModalName>;

type ModalProps =
  | CartModalProps
  | CountryOfOriginModalProps
  | ErrorModalProps
  | MenuModalProps
  | OrderHistoryModalProps
  | StaffCallModalProps
  | SuccessModalProps;

interface Modal<P = ModalProps> {
  name: ModalNameValue;
  ModalComponent: React.FC<P>;
  props: P;
}

interface ModalStore {
  modals: Modal[];
  openModal: <P extends ModalProps>(
    name: ModalNameValue,
    ModalComponent: React.FC<P>,
    props: P
  ) => void;
  closeModal: () => void;
  closeAllModals: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  modals: [],
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
