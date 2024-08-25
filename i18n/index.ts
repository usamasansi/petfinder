import i18n from "i18next";
import * as Localization from "expo-localization";
import { initReactI18next } from "react-i18next";
import en from "@/i18n/en/en_US.json";
import pl from "@/i18n/pl/pl_PL.json";

export const resources = {
  en: {
    translation: en,
  },
  pl: {
    translation: pl,
  },
};

const initI18n = async () => {
  const phoneLocale = Localization.getLocales()?.[0]?.languageCode ?? "en";
  console.log("🚀 ~ initI18n ~ phoneLocale:", phoneLocale);

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    debug: true,
    lng: phoneLocale,
    fallbackLng: "en",
    supportedLngs: ["en", "pl"],
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
