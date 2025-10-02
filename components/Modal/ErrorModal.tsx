import Modal from "@/components/Modal/Modal";

interface ErrorModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  close: () => void;
}

const ErrorModal = ({ isVisible, title, message, close }: ErrorModalProps) => {
  return (
    <Modal visible={isVisible}>
      <Modal.Title color="red">{title}</Modal.Title>
      <Modal.Content>{message}</Modal.Content>
      <Modal.ButtonContainer>
        <Modal.Button label="확인" onPress={close} />
      </Modal.ButtonContainer>
    </Modal>
  );
};

export default ErrorModal;
