import { Link, useNavigate, useParams } from "react-router-dom"
import indicators from "../../Data/indicators"
import { useTranslation } from "react-i18next"
import Style from "./IndicatorDetails.module.css"

/* ---------- Helpers ---------- */
const getPoints = (key, t) => {
  if (!key) return []
  const result = t(key, { returnObjects: true })
  return Array.isArray(result) ? result : []
}

function PointsSection({ titleKey, pointsKey, t }) {
  const points = getPoints(pointsKey, t)

  if (!titleKey || points.length === 0) return null

  return (
    <>
      <h3>{t(titleKey)}</h3>
      <ul className={Style.list}>
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </>
  )
}

/* ---------- Component ---------- */
export default function IndicatorDetails() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const indicator = indicators.find(i => String(i.id) === id)
  if (!indicator) return null

  return (
    <div className={Style.container}>
      {/* Back button */}
      <button
        className={Style.backBtn}
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <i className="fa-solid fa-arrow-left"></i>
        <span>{t("indicators.back")}</span>
      </button>

      {/* Image */}
      {indicator.image && (
        <img
          src={indicator.image}
          alt={t(indicator.titleKey)}
          className={Style.image}
        />
      )}

      {/* Title & Description */}
      <h1>{t(indicator.titleKey)}</h1>
      <p className={Style.description}>
        {t(indicator.descriptionKey)}
      </p>
      <Link to={'/Pricing'}>
      <button type="button" className={Style.explorebtn}>
        {t('home.hero.ctaPrimary')}
      </button>
      </Link>

      {/* Sections */}
      <PointsSection
        titleKey={indicator.marketstructureTitle}
        pointsKey={indicator.marketstructurePoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.swingPointsTitle}
        pointsKey={indicator.swingPoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.order_blocksTitle}
        pointsKey={indicator.order_blocksPoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.fvgtitle}
        pointsKey={indicator.fvgPoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.liquiditytitle}
        pointsKey={indicator.liquidityPoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.zonestitle}
        pointsKey={indicator.zonesPoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.trendlinestitle}
        pointsKey={indicator.trendlinesPoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.mtf_dashboardtitle}
        pointsKey={indicator.mtf_dashboardPoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.wavetrendtitle}
        pointsKey={indicator.wavetrendpoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.signalstitle}
        pointsKey={indicator.signalspoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.divergencetitle}
        pointsKey={indicator.divergencepoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.momentumtitle}
        pointsKey={indicator.momentumpoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.visualstitle}
        pointsKey={indicator.visualspoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.trenddetectiontitle}
        pointsKey={indicator.trenddetectionpoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.visual_signalstitle}
        pointsKey={indicator.visual_signalspoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.ema_cloudtitle}
        pointsKey={indicator.ema_cloudpoints}
        t={t}
      />

      <PointsSection
        titleKey={indicator.usabilitytitle}
        pointsKey={indicator.usabilitypoints}
        t={t}
      />

      {/* Footer texts */}
      {indicator.audience && <h3>{t(indicator.audience)}</h3>}
      {indicator.disclaimer && <h3>{t(indicator.disclaimer)}</h3>}
    </div>
  )
}