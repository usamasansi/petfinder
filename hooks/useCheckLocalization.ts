import i18n from "i18next";
import * as Localization from "expo-localization";
import { initReactI18next } from "react-i18next";
import { useEffect, useState } from "react";
import en from "../i18n/en/en_US.json";
import pl from "../i18n/pl/pl_PL.json";

export function useCheckLocalization() {
  // State to track if we've initialized i18n
  const [languageLoaded, setLanguageLoaded] = useState(false);
  // Our language (locale) to use
  const [language, setLanguage] = useState<string | null>();

  useEffect(() => {
    // We either don't have a language or we've already initialized
    if (!language) return;
    i18n.use(initReactI18next).init({
      compatibilityJSON: "v3",
      resources: {
        en: {
          translation: en,
        },
        pl: {
          translation: pl,
        },
      },
      lng: language,
      fallbackLng: "en",
      supportedLngs: ["en", "pl"],
    });
    setLanguageLoaded(true);
  }, [language, languageLoaded]);

  useEffect(() => {
    // I realize we don't need this to be async, but I'll get to why in another article.
    const getSystemLanguageAndSet = async () => {
      // Get the device's current system locale from expo-localization
      const phoneLocale =
        Localization.getLocales()?.[0]?.languageTag ?? "en-US";
      setLanguage(phoneLocale);
    };

    getSystemLanguageAndSet();
  }, []);
}
