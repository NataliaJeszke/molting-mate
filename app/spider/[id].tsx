import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

import { useSpidersStore } from "@/store/spidersStore";

import SpiderDetails from "@/core/SpiderDetail/SpiderDetail";

import WrapperComponent from "@/components/ui/WrapperComponent";
import { ThemedText } from "@/components/ui/ThemedText";

export default function SpiderDetail() {
  const { id } = useLocalSearchParams();
  const spider = useSpidersStore((state) =>
    state.spiders.find((spider) => spider.id === id),
  );

  if (!spider) return <ThemedText>Pająk nie znaleziony.</ThemedText>;

  return (
    <WrapperComponent>
      <ScrollView>
        <SpiderDetails spider={spider} />
      </ScrollView>
    </WrapperComponent>
  );
}
