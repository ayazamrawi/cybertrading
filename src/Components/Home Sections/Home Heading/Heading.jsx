import Typewriter from "typewriter-effect";
import Style from "./Heading.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Heading() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";


  const text = t("home.hero.typewriter.same").replace(/<br\s*\/?>/gi, "\n");

  return (
    <header id="Home" className={Style.header}>
      <div className={Style.mainHead}>
        <div className={Style.headLayer}>
          <h1
            className={Style.h1}
            dir={isArabic ? "rtl" : "ltr"}
            lang={i18n.language}
          >
            {isArabic ? (
              // ✅ عربي: بدون typewriter (حل Safari)
              <span style={{ whiteSpace: "pre-line" }}>{text}</span>
            ) : (
              // ✅ EN/DE: Typewriter عادي
              <Typewriter
                key={i18n.language}
                options={{
                  delay: 50,
                  cursor: "_",
                  autoStart: true,
                  loop: false,
                }}
                onInit={(typewriter) => {
                  typewriter.typeString(text).start();
                }}
              />
            )}
          </h1>

          <p className={Style.subheadline}>
            {t("home.hero.subheadlineLine1")}
            <br />
          </p>

          <Link to="/Pricing">
            <button type="button" className={Style.ctaBtn}>
              {t("home.hero.ctaPrimary")}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
