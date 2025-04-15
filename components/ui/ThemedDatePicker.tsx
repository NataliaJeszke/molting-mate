import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { StyleSheet } from "react-native";
import { ThemeType } from "@/constants/Colors";
import { Colors } from "@/constants/Colors";

type ThemedDatePickerProps = {
  isVisible: boolean;
  initialDate: Date;
  theme: ThemeType;
  onConfirm: (formattedDate: string) => void;
  onCancel: () => void;
};

const ThemedDatePicker: React.FC<ThemedDatePickerProps> = ({
  isVisible,
  initialDate,
  theme,
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

const styles = (theme: ThemeType) =>
  StyleSheet.create({
    "themed-picker__container": {
      marginBottom: 24,
      padding: 10,
    },
    "themed-picker__label": {
      fontSize: 14,
      marginBottom: 8,
      color: Colors[theme].picker.label.color,
    },
    "themed-picker__picker-wrapper": {
      overflow: "hidden",
    },
  });

export default ThemedDatePicker;
