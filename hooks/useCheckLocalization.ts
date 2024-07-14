import i18n from "i18next";
import * as Localization from "expo-localization";
import { initReactI18next } from "react-i18next";
import { useEffect, useState } from "react";
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

export function useCheckLocalization() {
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [language, setLanguage] = useState<string | null>();

  useEffect(() => {
    if (!language) return;
    i18n.use(initReactI18next).init({
      compatibilityJSON: "v3",
      resources,
      lng: language,
      fallbackLng: "en",
      supportedLngs: ["en", "pl"],
    });
    setLanguageLoaded(true);
  }, [language, languageLoaded]);

  useEffect(() => {
    const getSystemLanguageAndSet = async () => {
      const phoneLocale =
        Localization.getLocales()?.[0]?.languageTag ?? "en-US";
      setLanguage(phoneLocale);
    };

    getSystemLanguageAndSet();
  }, []);
}
