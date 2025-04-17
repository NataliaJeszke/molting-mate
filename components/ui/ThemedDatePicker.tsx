import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

type ThemedDatePickerProps = {
  isVisible: boolean;
  initialDate: Date;
  onConfirm: (formattedDate: string) => void;
  onCancel: () => void;
};

function ThemedDatePicker(props: ThemedDatePickerProps) {
  const { isVisible, initialDate, onConfirm, onCancel } = props;

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
    />
  );
}

export default ThemedDatePicker;
