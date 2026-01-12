import { I18n } from "i18n-js";

import en from "./locales/en.json";
import pl from "./locales/pl.json";

import { useUserStore } from "../store/userStore";
import { Language } from "../constants/Language";

const i18n = new I18n({
  [Language.EN]: en,
  [Language.PL]: pl,
});

const userLang = useUserStore.getState().language;
i18n.locale = userLang === Language.PL ? "pl" : "en";
i18n.enableFallback = true;

export const t = (key: string, config?: Record<string, any>) =>
  i18n.t(key, config);

export default i18n;
