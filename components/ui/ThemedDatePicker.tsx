import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

type ThemedDatePickerProps = {
  isVisible: boolean;
  initialDate: Date;
  maximumDate?: Date;
  onConfirm: (formattedDate: string) => void;
  onCancel: () => void;
};

const ThemedDatePicker = ({
  isVisible,
  initialDate,
  maximumDate,
  onConfirm,
  onCancel,
}: ThemedDatePickerProps) => {
  const handleConfirm = (date: Date) => {
    const formatted = format(date, "dd-MM-yyyy");
    onConfirm(formatted);
  };

  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode="date"
      date={initialDate}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      confirmTextIOS="Zatwierdź"
      cancelTextIOS="Anuluj"
      maximumDate={maximumDate}
    />
  );
};

export default ThemedDatePicker;
