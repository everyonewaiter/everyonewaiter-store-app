import { useReducer, useState } from "react";

export const WaitingFormName = {
  PHONE_NUMBER: "phoneNumber",
  ADULT: "adult",
  INFANT: "infant",
} as const;

type PersonCountAction = "increase" | "decrease" | "reset";
type ExposedPersonCountAction = Exclude<PersonCountAction, "reset">;

const personCountReducer = (state: number, action: PersonCountAction) => {
  switch (action) {
    case "increase":
      return state < 30 ? state + 1 : 30;
    case "decrease":
      return state > 0 ? state - 1 : 0;
    case "reset":
      return 0;
    default:
      throw new Error(`[personCountReducer] Unknown action type ${action}`);
  }
};

const useWaitingForm = () => {
  const [withoutPrefixPhone, setWithoutPrefixPhone] = useState("");
  const [adult, adultDispatcher] = useReducer(personCountReducer, 0);
  const [infant, infantDispatcher] = useReducer(personCountReducer, 0);

  const isEmptyForm = withoutPrefixPhone.length === 0 && adult === 0 && infant === 0;
  const isValidForm = withoutPrefixPhone.length === 8 && adult > 0;

  const handleOnChangePhone = (value: string) => {
    if (value.length <= 8) {
      setWithoutPrefixPhone(value);
    }
  };

  const handleOnChangeAdult = (action: ExposedPersonCountAction) => {
    adultDispatcher(action);
  };

  const handleOnChangeInfant = (action: ExposedPersonCountAction) => {
    infantDispatcher(action);
  };

  const resetAllState = () => {
    setWithoutPrefixPhone("");
    adultDispatcher("reset");
    infantDispatcher("reset");
  };

  return {
    form: {
      [WaitingFormName.PHONE_NUMBER]: withoutPrefixPhone,
      [WaitingFormName.ADULT]: adult,
      [WaitingFormName.INFANT]: infant,
    },
    handleOnChange: {
      [WaitingFormName.PHONE_NUMBER]: handleOnChangePhone,
      [WaitingFormName.ADULT]: handleOnChangeAdult,
      [WaitingFormName.INFANT]: handleOnChangeInfant,
    },
    isEmptyForm,
    isValidForm,
    resetAllState,
  };
};

export default useWaitingForm;
