import { useState } from "react";

import useModalStore from "@/stores/modal";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
};

const useModals = () => {
  const modals = useModalStore((state) => state.modals);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const closeAllModals = useModalStore((state) => state.closeAllModals);

  return { modals, openModal, closeModal, closeAllModals };
};

export default useModals;
