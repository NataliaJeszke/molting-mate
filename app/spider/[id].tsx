import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

import SpiderDetails from "@/core/SpiderDetail/SpiderDetail";

import WrapperComponent from "@/components/ui/WrapperComponent";
import { ThemedText } from "@/components/ui/ThemedText";

export default function SpiderDetail() {
  const { id } = useLocalSearchParams();

  if (!id) return <ThemedText>Pająk nie znaleziony.</ThemedText>;

  return (
    <WrapperComponent>
      <ScrollView>
        <SpiderDetails spiderId={id} />
      </ScrollView>
    </WrapperComponent>
  );
}
