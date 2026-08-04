import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import de from "./locales/de.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      de: { translation: de }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    load:"languageOnly"
  });
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr"
  document.documentElement.lang = lng
})
export default i18n;
