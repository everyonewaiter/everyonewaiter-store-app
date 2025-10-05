import { useShallow } from "zustand/react/shallow";

import useModalStore from "@/stores/modal";

const useModal = () => {
  const [modals, isOpenedModal, openModal, closeModal, closeAllModals] = useModalStore(
    useShallow((state) => [
      state.modals,
      state.isOpenedModal,
      state.openModal,
      state.closeModal,
      state.closeAllModals,
    ])
  );

  return { modals, isOpenedModal: isOpenedModal(), openModal, closeModal, closeAllModals };
};

export default useModal;
