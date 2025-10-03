import useModals from "@/hooks/useModal";

const ModalProvider = () => {
  const { modals } = useModals();

  return (
    <>
      {modals.map(({ name, ModalComponent, props }) => (
        <ModalComponent key={name} {...props} />
      ))}
    </>
  );
};

export default ModalProvider;
