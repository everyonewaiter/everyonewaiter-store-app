import { Modal } from "@/components/Modal";

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
      <Modal.Container>
        <Modal.Title color="black">{title}</Modal.Title>
        <Modal.Content image={image}>{message}</Modal.Content>
        <Modal.ButtonContainer>
          <Modal.Button label="확인" onPress={close} />
        </Modal.ButtonContainer>
      </Modal.Container>
    </Modal>
  );
};

export default SuccessModal;
