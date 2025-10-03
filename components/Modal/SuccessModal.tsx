import Modal, { BaseModalProps } from "@/components/Modal/Modal";

export interface SuccessModalProps extends BaseModalProps {
  title: string;
  image?: string;
  message: string;
}

const SuccessModal = ({ title, image, message, onClose }: SuccessModalProps) => {
  return (
    <Modal>
      <Modal.Title color="black">{title}</Modal.Title>
      <Modal.Content image={image}>{message}</Modal.Content>
      <Modal.ButtonContainer>
        <Modal.Button label="확인" onPress={onClose} />
      </Modal.ButtonContainer>
    </Modal>
  );
};

export default SuccessModal;
