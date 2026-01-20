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
import { OrderFlowError } from "@/utils/error";
import { parseErrorMessage } from "@/utils/support";

export interface OrderConfirmModalProps {
  device: Device;
  store: Store;
  orderSuccessCallback: () => void;
}

const OrderConfirmModal = ({ device, store, orderSuccessCallback }: OrderConfirmModalProps) => {
  const [isPending, setIsPending] = useState(false);

  const { mutateAsync: mutateCreateOrder } = useCreateTableOrder();
  const { mutateAsync: mutateCreatePayment } = useCreateCardPayment();

  const { cart, calculateCartTotalPrice } = useCart();
  const { openModal, closeModal, closeAllModals } = useModal();

  const handleOnSubmit = async () => {
    try {
      setIsPending(true);
      if (device.paymentType === "POSTPAID") {
        await createOrder();
      } else {
        validateDeviceNo();

        const amount = calculateCartTotalPrice();
        const service = calculateService(amount, 0);
        const vat = calculateVat(amount, service, 10);

        const response = await approveKscat(amount);
        await createPayment(response, amount, service, vat);
        await createOrder();
      }
    } catch (error: any) {
      if (error instanceof OrderFlowError) {
        openModal(ModalName.ORDER_FLOW_ERROR, ErrorModal, {
          title: error.title,
          message: parseErrorMessage(error),
          onClose: closeAllModals,
        });
      }
    } finally {
      setIsPending(false);
    }
  };

  const createOrder = async () => {
    try {
      await mutateCreateOrder({ tableNo: device.tableNo, memo: "", orderMenus: cart });
      openModal(ModalName.ORDER_SUCCESS, SuccessModal, {
        title: "주문 완료",
        image: images.COMPLETE_ANIMATION,
        message: "주문이 완료되었습니다.",
        onClose: orderSuccessCallback,
      });
    } catch (error: any) {
      throw new OrderFlowError("주문 실패", parseErrorMessage(error));
    }
  };

  const validateDeviceNo = () => {
    const ksnetDeviceNo = store.setting.ksnetDeviceNo;
    if (ksnetDeviceNo.length < 8 || ksnetDeviceNo.startsWith("DPTOTEST")) {
      throw new OrderFlowError(
        "단말기 번호가 등록되지 않았습니다.",
        "설정 페이지에서 KSNET 단말기 번호를 등록해주세요."
      );
    }
  };

  const approveKscat = async (amount: number) => {
    try {
      const deviceNo = store.setting.ksnetDeviceNo;
      return await KscatModule.approveIC(deviceNo, "00", amount);
    } catch (exception: any) {
      if (exception.code === "FAIL") {
        throw new OrderFlowError("결제 실패", exception.message);
      } else {
        throw new OrderFlowError("결제 오류", exception.message);
      }
    }
  };

  const createPayment = async (
    res: KscatResponse,
    amount: number,
    service: number,
    vat: number
  ) => {
    try {
      await mutateCreatePayment({
        tableNo: device.tableNo,
        amount: amount,
        approvalNo: res.approvalNo,
        installment: "00",
        cardNo: res.filler,
        issuerName: res.message1,
        purchaseName: res.purchaseCompanyName,
        merchantNo: res.merchantNo,
        tradeTime: res.transferDate,
        tradeUniqueNo: res.transactionUniqueNo,
        vat: vat,
        supplyAmount: amount - service - vat,
      });
    } catch (error: any) {
      throw new OrderFlowError(
        "오류: 직원을 호출하여 결제를 취소하세요.",
        parseErrorMessage(error)
      );
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
          disabled={isPending}
        />
      </Modal.ButtonContainer>
    </Modal>
  );
};

export default OrderConfirmModal;
