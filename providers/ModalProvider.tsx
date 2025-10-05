import useModal from "@/hooks/useModal";

const ModalProvider = () => {
  const { modals } = useModal();

  return (
    <>
      {modals.map(({ name, ModalComponent, props }) => (
        <ModalComponent key={name} {...props} />
      ))}
    </>
  );
};

export default ModalProvider;
