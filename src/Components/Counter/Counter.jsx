import { useEffect, useState } from "react";
import { FaBolt } from "react-icons/fa";
import Style from "./Counter.module.css";
import { useTranslation } from "react-i18next";

const OPENING_DATE = new Date("2026-02-01T00:00:00");

function calculateTimeLeft() {
  const diff = OPENING_DATE.getTime() - new Date().getTime();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Counter() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const {t} = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      const t = calculateTimeLeft();
      if (t) setTimeLeft(t);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className={Style.openingCounter}>
      <div className="container d-flex flex-wrap justify-content-center align-items-center gap-2">
        <span className={Style.counterText}>
          <FaBolt className="me-2" />
          <strong>{t('counter.opening')}</strong>
        </span>

        <div className={Style.counterBoxes}>
          <CounterBox label="Days" value={timeLeft.days} />
          <CounterBox label="Hours" value={timeLeft.hours} />
          <CounterBox label="Minutes" value={timeLeft.minutes} />
          <CounterBox label="Seconds" value={timeLeft.seconds} />
        </div>
      </div>
    </div>
  );
}

function CounterBox({ value, label }) {
  return (
    <div className={Style.counterBox}>
      <span className={Style.counterValue}>{value}</span>
      <span className={Style.counterLabel}>{label}</span>
    </div>
  );
}
