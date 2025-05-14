import { useUserStore } from "@/store/userStore";
import i18n, { t as translate } from "@/language/i18n";
import { useSyncExternalStore } from "react";

export const useTranslation = () => {
  useSyncExternalStore(
    useUserStore.subscribe,
    () => useUserStore.getState().language,
  );

  const language = useUserStore((state) => state.language);
  i18n.locale = language === "pl" ? "pl" : "en";

  return {
    t: translate,
    locale: i18n.locale,
  };
};
