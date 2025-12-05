import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hi from "./hi.json";
import ta from "./ta.json";
import bn from "./bn.json";
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      bn: { translation: bn },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
