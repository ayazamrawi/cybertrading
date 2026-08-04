import react from "react";
import Style from './LoadingScreen.module.css';
import { Typewriter } from 'react-simple-typewriter';
import { useTranslation } from "react-i18next";

export default function LoadingScreen() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className={Style.loader}>
        <p
          className={Style.sentacs}
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <Typewriter
            words={[t("loading.text")]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={3000}
          />
        </p>
        <span className={Style.line}></span>
      </div>
    </>
  );
}
