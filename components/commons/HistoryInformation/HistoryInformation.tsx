import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Colors, ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import CardComponent from "@/components/ui/CardComponent";

interface HistoryInformationProps {
  title: string;
  iconName: keyof typeof Feather.glyphMap;
  data: string[] | undefined;
  currentTheme: ThemeType;
  styles: any;
  emptyText: string;
  typeKey: string;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

const HistoryInformation = ({
  title,
  iconName,
  data,
  currentTheme,
  styles,
  emptyText,
  typeKey,
  isExpanded,
  toggleExpanded,
}: HistoryInformationProps) => {
  return (
    <CardComponent customStyle={styles(currentTheme).historyCard}>
      <TouchableOpacity
        style={styles(currentTheme).historyCard__header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles(currentTheme).historyCard__headerContent}>
          <Feather
            name={iconName}
            size={20}
            color={Colors[currentTheme].text}
            style={styles(currentTheme).historyCard__icon}
          />
          <ThemedText style={styles(currentTheme).historyCard__title}>
            {title}
          </ThemedText>
        </View>
        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={Colors[currentTheme].text}
        />
      </TouchableOpacity>

      {isExpanded && data && data.length > 0 ? (
        <View style={styles(currentTheme).historyCard__content}>
          {data.map((item, index) => (
            <View
              key={`${typeKey}-${index}`}
              style={[
                styles(currentTheme).historyCard__item,
                index === data.length - 1
                  ? styles(currentTheme)["historyCard__item--last"]
                  : null,
              ]}
            >
              <Feather
                name="calendar"
                size={16}
                color={Colors[currentTheme].text}
                style={styles(currentTheme).historyCard__itemIcon}
              />
              <ThemedText style={styles(currentTheme).historyCard__itemText}>
                {item}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : isExpanded ? (
        <View style={styles(currentTheme).historyCard__empty}>
          <ThemedText style={styles(currentTheme).historyCard__emptyText}>
            {emptyText}
          </ThemedText>
        </View>
      ) : null}
    </CardComponent>
  );
};

export default HistoryInformation;
