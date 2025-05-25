import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

import SpiderDetails from "@/core/SpiderDetail/SpiderDetail";

import WrapperComponent from "@/components/ui/WrapperComponent";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTranslation } from "@/hooks/useTranslation";

export default function SpiderDetail() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();

  if (!id)
    return <ThemedText>{t("spider-detail.spider_not_found")}</ThemedText>;

  return (
    <WrapperComponent>
      <ScrollView>
        <SpiderDetails spiderId={id} />
      </ScrollView>
    </WrapperComponent>
  );
}
