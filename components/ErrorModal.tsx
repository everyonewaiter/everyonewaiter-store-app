import { Modal } from '@/components/Modal'

interface ErrorModalProps {
  isVisible: boolean
  title: string
  message: string
  close: () => void
}

const ErrorModal = ({ isVisible, title, message, close }: ErrorModalProps) => {
  return (
    <Modal visible={isVisible}>
      <Modal.Container>
        <Modal.Title color="red">{title}</Modal.Title>
        <Modal.Content>{message}</Modal.Content>
        <Modal.ButtonContainer>
          <Modal.Button label="확인" onPress={close} />
        </Modal.ButtonContainer>
      </Modal.Container>
    </Modal>
  )
}

export default ErrorModal
