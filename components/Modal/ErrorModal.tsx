import Modal, { BaseModalProps } from "@/components/Modal/Modal";

export interface ErrorModalProps extends BaseModalProps {
  title: string;
  message: string;
}

const ErrorModal = ({ title, message, onClose }: ErrorModalProps) => {
  return (
    <Modal>
      <Modal.Title color="red">{title}</Modal.Title>
      <Modal.Content>{message}</Modal.Content>
      <Modal.ButtonContainer>
        <Modal.Button label="확인" onPress={onClose} />
      </Modal.ButtonContainer>
    </Modal>
  );
};

export default ErrorModal;
