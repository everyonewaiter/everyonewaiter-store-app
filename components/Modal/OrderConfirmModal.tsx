import { useState } from "react";

import ErrorModal from "@/components/Modal/ErrorModal";
import Modal from "@/components/Modal/Modal";
import SuccessModal from "@/components/Modal/SuccessModal";
import { images } from "@/constants/images";
import useCart from "@/hooks/useCart";
import useModal from "@/hooks/useModal";
import { useCreateTableOrder } from "@/hooks/useOrderApi";
import { useCreateCardPayment } from "@/hooks/usePaymentApi";
import { KscatResponse } from "@/modules/kscat";
import KscatModule from "@/modules/kscat/src/KscatModule";
import { ModalName } from "@/stores/modal";
import { Device } from "@/types/device";
import { Store } from "@/types/store";
import { calculateService, calculateVat } from "@/utils/calculate";
import { parseErrorMessage } from "@/utils/support";

export interface OrderConfirmModalProps {
  device: Device;
  store: Store;
  orderSuccessCallback: () => void;
}

interface OrderStep {
  current: "INIT" | "PAYMENT" | "SAVE_PAYMENT" | "ORDER" | "PENDING" | "ERROR";
  res: KscatResponse | null;
}

const OrderConfirmModal = ({ device, store, orderSuccessCallback }: OrderConfirmModalProps) => {
  const [orderStep, setOrderStep] = useState<OrderStep>({ current: "INIT", res: null });

  const { mutateAsync: mutateCreateOrder } = useCreateTableOrder();
  const { mutateAsync: mutateCreatePayment } = useCreateCardPayment();

  const { cart, calculateCartTotalPrice } = useCart();
  const { openModal, closeModal, closeAllModals } = useModal();

  const handleOnSubmit = async () => {
    if (device.paymentType === "POSTPAID") {
      await createOrder();
    } else {
      validateDeviceNo();

      const amount = calculateCartTotalPrice();
      const service = calculateService(amount, 0);
      const vat = calculateVat(amount, service, 10);

      await approveKscat(amount);
      await createPayment(amount, service, vat);
      await createOrder();
    }
  };

  const createOrder = async () => {
    if (orderStep.current === "INIT" || orderStep.current === "SAVE_PAYMENT") {
      setOrderStep((prev) => ({ ...prev, current: "PENDING" }));

      try {
        await mutateCreateOrder({ tableNo: device.tableNo, memo: "", orderMenus: cart });
        openModal(ModalName.ORDER_SUCCESS, SuccessModal, {
          title: "주문 완료",
          image: images.COMPLETE_ANIMATION,
          message: "주문이 완료되었습니다.",
          onClose: orderSuccessCallback,
        });
      } catch (error: any) {
        setOrderStep((prev) => ({ ...prev, current: "ERROR" }));
        openModal(ModalName.ORDER_ERROR, ErrorModal, {
          title: "주문 실패",
          message: parseErrorMessage(error),
          onClose: closeAllModals,
        });
      }
    }
  };

  const validateDeviceNo = () => {
    const ksnetDeviceNo = store.setting.ksnetDeviceNo;
    if (ksnetDeviceNo.length < 8 || ksnetDeviceNo.startsWith("DPTOTEST")) {
      setOrderStep((prev) => ({ ...prev, current: "ERROR" }));
      openModal(ModalName.KSNET_DEVICE_NO_NOT_INITIALIZED, ErrorModal, {
        title: "단말기 번호가 등록되지 않았습니다.",
        message: "설정 페이지에서 KSNET 단말기 번호를 등록해주세요.",
        onClose: closeAllModals,
      });
    }
  };

  const approveKscat = async (amount: number) => {
    if (orderStep.current === "INIT") {
      try {
        const deviceNo = store.setting.ksnetDeviceNo;
        const response = await KscatModule.approveIC(deviceNo, "00", amount);
        setOrderStep(() => ({ current: "PAYMENT", res: response }));
      } catch (exception: any) {
        setOrderStep((prev) => ({ ...prev, current: "ERROR" }));
        if (exception.code === "FAIL") {
          openModal(ModalName.KSNET_PAYMENT_ERROR, ErrorModal, {
            title: "결제 실패",
            message: exception.message,
            onClose: closeAllModals,
          });
        } else {
          openModal(ModalName.KSNET_PAYMENT_ERROR, ErrorModal, {
            title: "결제 오류",
            message: exception.message,
            onClose: closeAllModals,
          });
        }
      }
    }
  };

  const createPayment = async (amount: number, service: number, vat: number) => {
    if (orderStep.current === "PAYMENT" && orderStep.res !== null) {
      try {
        await mutateCreatePayment({
          tableNo: device.tableNo,
          amount: amount,
          approvalNo: orderStep.res.approvalNo,
          installment: "00",
          cardNo: orderStep.res.filler,
          issuerName: orderStep.res.message1,
          purchaseName: orderStep.res.purchaseCompanyName,
          merchantNo: orderStep.res.merchantNo,
          tradeTime: orderStep.res.transferDate,
          tradeUniqueNo: orderStep.res.transactionUniqueNo,
          vat: vat,
          supplyAmount: amount - service - vat,
        });
        setOrderStep((prev) => ({ ...prev, current: "SAVE_PAYMENT" }));
      } catch (error: any) {
        setOrderStep((prev) => ({ ...prev, current: "ERROR" }));
        openModal(ModalName.ORDER_PAYMENT_ERROR, ErrorModal, {
          title: "오류: 직원을 호출하여 결제를 취소하세요.",
          message: parseErrorMessage(error),
          onClose: closeAllModals,
        });
      }
    }
  };

  return (
    <Modal>
      <Modal.Title color="black">주문하시겠습니까?</Modal.Title>
      <Modal.Content>주문하기 전에 장바구니에 담긴 메뉴를 다시 한번 확인해주세요.</Modal.Content>
      <Modal.ButtonContainer>
        <Modal.Button label="닫기" color="gray" onPress={closeModal} />
        <Modal.Button
          label={device.paymentType === "POSTPAID" ? "주문하기" : "결제하고 주문하기"}
          color="red"
          onPress={handleOnSubmit}
          disabled={orderStep.current !== "INIT"}
        />
      </Modal.ButtonContainer>
    </Modal>
  );
};

export default OrderConfirmModal;
