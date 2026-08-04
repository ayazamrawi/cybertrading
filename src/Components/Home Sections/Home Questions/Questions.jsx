import React, { useMemo, useState, useEffect } from "react";
import Style from "./Questions.module.css";
import { useTranslation } from "react-i18next";

export default function Questions() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const faqItems = useMemo(() => {
    const items = t("home.faq.items", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t, i18n.language]);

  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setOpenIndex(null); // اختياري: اقفلي الكل عند تغيير اللغة
  }, [i18n.language]);

  const toggle = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <section className="container text-center faq pt-5">
      <h2 className={`${Style.faqH2} pb-2`}>{t("home.faq.title")}</h2>

      <div className={`container mt-5 ${Style.faqContainer}`}>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          const q = item?.q ?? item?.question ?? "—";
          const a = item?.a ?? item?.answer ?? "";

          return (
            <div key={index} className={`${Style.question} w-75 m-auto mb-1`}>
              {/* Title (click anywhere to toggle) */}
              <div
                className={`${Style.questionTitle} rounded-top-4 d-flex justify-content-between align-items-center p-2 ps-3 pe-3`}
                dir={isRTL ? "rtl" : "ltr"}
                role="button"
                tabIndex={0}
                onClick={() => toggle(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggle(index);
                }}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
              >
                <h3 className="h4 m-0">{q}</h3>

                {/* Stop propagation so button doesn't double-trigger */}
                <button
                  type="button"
                  className={`${Style.faqButton} d-flex justify-content-center align-items-center`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(index);
                  }}
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  {isOpen ? "−" : "+"}
                </button>
              </div>

              {/* Body (NO display none) */}
              <div
                id={`faq-panel-${index}`}
                className={`${Style.questionBody} ${
                  isOpen ? Style.questionBodyOpen : ""
                } p-2 ps-3 pe-3 rounded-bottom-4`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <p className={Style.answer} style={{ margin: 0 }}>
                  {a || "—"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
