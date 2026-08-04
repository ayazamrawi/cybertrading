import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import userApi from "../Services/userApi";
import affiliateApi from "../Services/affiliateApi";

const LanguageContext = createContext();

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);

  const userChangedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const initLanguage = async () => {
      try {
        const deviceLang = localStorage.getItem("language");
        const userToken = localStorage.getItem("token");
        const affiliateToken = localStorage.getItem("affiliateToken");

        let finalLang = "en";

        if (deviceLang) {
          finalLang = deviceLang;
        } else if (userToken) {
          const res = await userApi.get("/user/language");
          finalLang = res?.data?.language || "en";
          localStorage.setItem("language", finalLang);
        } else if (affiliateToken) {
          const res = await affiliateApi.get("/affiliate/language");
          finalLang = res?.data?.language || "en";
          localStorage.setItem("language", finalLang);
        }

        // ✅ لو المستخدم غيّر اللغة بنفسه أثناء init → ما تعملش override
        if (cancelled || userChangedRef.current) return;

        setLanguage(finalLang);
        await i18n.changeLanguage(finalLang);
      } catch (e) {
        if (cancelled) return;
        setLanguage("en");
        await i18n.changeLanguage("en");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initLanguage();
    return () => { cancelled = true; };
  }, [i18n]);

  const changeLanguage = async (newLanguage) => {
    try {
      userChangedRef.current = true; // ✅ مهم
      setLanguage(newLanguage);
      localStorage.setItem("language", newLanguage);
      await i18n.changeLanguage(newLanguage);

      const userToken = localStorage.getItem("token");
      const affiliateToken = localStorage.getItem("affiliateToken");

      if (userToken) {
        await userApi.post("/user/update-language", { language: newLanguage });
      } else if (affiliateToken) {
        await affiliateApi.post("/affiliate/update-language", { language: newLanguage });
      }
    } catch (e) {
      console.error("Language change failed:", e);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};
