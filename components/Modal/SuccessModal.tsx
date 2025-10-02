import Modal from "@/components/Modal/Modal";

interface SuccessModalProps {
  isVisible: boolean;
  title: string;
  image?: string;
  message: string;
  close: () => void;
}

const SuccessModal = ({ isVisible, title, image, message, close }: SuccessModalProps) => {
  return (
    <Modal visible={isVisible}>
      <Modal.Title color="black">{title}</Modal.Title>
      <Modal.Content image={image}>{message}</Modal.Content>
      <Modal.ButtonContainer>
        <Modal.Button label="확인" onPress={close} />
      </Modal.ButtonContainer>
    </Modal>
  );
};

export default SuccessModal;
