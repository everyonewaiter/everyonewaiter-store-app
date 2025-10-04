import Modal, { BaseSubmitModalProps } from "@/components/Modal/Modal";

export interface SubmitModalProps extends BaseSubmitModalProps {
  title: string;
  message: string;
}

const SubmitModal = ({
  title,
  message,
  submitButtonLabel = "확인",
  onClose,
  onSubmit,
  ...props
}: SubmitModalProps) => {
  return (
    <Modal>
      <Modal.Title color="red">{title}</Modal.Title>
      <Modal.Content>{message}</Modal.Content>
      <Modal.ButtonContainer>
        <Modal.Button label="닫기" color="gray" onPress={onClose} />
        <Modal.Button label={submitButtonLabel} color="black" onPress={onSubmit} {...props} />
      </Modal.ButtonContainer>
    </Modal>
  );
};

export default SubmitModal;
