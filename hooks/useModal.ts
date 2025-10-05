import useModalStore from "@/stores/modal";

const useModal = () => {
  const modals = useModalStore((state) => state.modals);
  const isOpenModal = useModalStore((state) => state.isOpenModal);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const closeAllModals = useModalStore((state) => state.closeAllModals);

  return { modals, isOpenModal, openModal, closeModal, closeAllModals };
};

export default useModal;
