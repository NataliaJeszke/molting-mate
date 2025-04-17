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

export default function HistoryInformation({
  title,
  iconName,
  data,
  currentTheme,
  styles,
  emptyText,
  typeKey,
  isExpanded,
  toggleExpanded,
}: HistoryInformationProps) {
  return (
    <CardComponent customStyle={styles(currentTheme).historyCard}>
      <TouchableOpacity 
        style={styles(currentTheme).historyHeader}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles(currentTheme).historyHeaderContent}>
          <Feather
            name={iconName}
            size={20}
            color={Colors[currentTheme].text}
            style={styles(currentTheme).historyIcon}
          />
          <ThemedText style={styles(currentTheme).historyTitle}>
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
        <View style={styles(currentTheme).historyContent}>
          {data.map((item, index) => (
            <View 
              key={`${typeKey}-${index}`} 
              style={[
                styles(currentTheme).historyItem,
                index === data.length - 1 ? styles(currentTheme).historyItemLast : null
              ]}
            >
              <Feather
                name="calendar"
                size={16}
                color={Colors[currentTheme].text}
                style={styles(currentTheme).historyItemIcon}
              />
              <ThemedText style={styles(currentTheme).historyItemText}>
                {item}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : isExpanded ? (
        <View style={styles(currentTheme).emptyHistory}>
          <ThemedText style={styles(currentTheme).emptyHistoryText}>
            {emptyText}
          </ThemedText>
        </View>
      ) : null}
    </CardComponent>
  );
}