import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

type ThemedDatePickerProps = {
  isVisible: boolean;
  initialDate: Date;
  onConfirm: (formattedDate: string) => void;
  onCancel: () => void;
};

const ThemedDatePicker: React.FC<ThemedDatePickerProps> = ({
  isVisible,
  initialDate,
  onConfirm,
  onCancel,
}) => {
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
      confirmTextIOS={"Zatwierdź"}
      cancelTextIOS={"Anuluj"}
    />
  );
};

export default ThemedDatePicker;
