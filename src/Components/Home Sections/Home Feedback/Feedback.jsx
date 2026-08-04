import React, { useEffect } from "react";
import Style from './Feedback.module.css';
import { useDragSlider } from '../../../Hooks/useDragSlider';
import { useTranslation } from "react-i18next";

export default function Feedback(){
    const { t } = useTranslation();
        const setupSlider = useDragSlider();
         useEffect(() => {
                const cleanupSlider = setupSlider();
                return () => {
                    if (cleanupSlider) {
                        cleanupSlider();
                    }
                };
            }, [ setupSlider]);
            
    return(
        <>
         <section className={Style.feedback}>
                        <div className="container pb-5">
                            <div className="row">
                                <div className="col-md-10">
                                    <div className={Style.feedbackHeading}>
                                        <h2 className="pb-3">
                                            {t("feedback.title")} 
                                        </h2>
                                    </div>
                                </div>
                                <div className="col-md-2 d-flex align-items-center">
                                    <button type="button" className={`${Style.arrowButton} slider-btn left-btn`}>
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <button type="button" className={`${Style.arrowButton} slider-btn right-btn`}>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                                <div className="row g-4">
                                    <div className={`${Style.dragSlider} d-flex gap-4`}>
                                        {/* Testimonial 1 */}
                                        <div className={`${Style.testimonialCard} p-4 rounded-4`}>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="row">
                                                    <div className="col">
                                            <h3>{t("feedback.client_one.head")}</h3>
                                            <p className="text-white pt-3">{t("feedback.client_one.comment")}</p>
                                            <div className="text-warning">
                                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                            </div>
                                                        
                                                            <h5 className="text-white mb-1 fw-bold pt-3">Matt Walker</h5>
                                                            <p className="text-secondary">{t("feedback.client_one.title")} </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
        
                                        {/* Testimonial 2 */}
                                        <div className={`${Style.testimonialCard} p-4 rounded-4`}>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="row">
                                                    <div className="col">
                                            <h3>{t("feedback.client_two.head")}</h3>

                                            <p className="text-white pt-3">{t("feedback.client_two.comment")}</p>
                                            <div className="text-warning">
                                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                            </div>
                                                            <h5 className="text-white mb-1 fw-bold pt-3">Sarah Johnson</h5>
                                                            <p className="text-secondary">{t("feedback.client_two.title")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
        
                                        {/* Testimonial 3 */}
                                        <div className={`${Style.testimonialCard} p-4 rounded-4`}>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="row">
                                                    
                                                    <div className="col">
                                                        <h3>{t("feedback.client_three.head")}</h3>
                                                        <p className="text-white pt-3">{t("feedback.client_three.comment")}</p>
                                                        <div className="text-warning">
                                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                            </div>
                                                        <h5 className="text-white mb-1 fw-bold pt-3">Alex Chen</h5>
                                                        <p className="text-secondary">{t("feedback.client_three.title")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Testimonial 4 */}
                                        <div className={`${Style.testimonialCard} p-4 rounded-4`}>
    <h3>{t("feedback.client_four.head")}</h3>
    <p className="text-white pt-3">{t("feedback.client_four.comment")}</p>

    <div className="text-warning">
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
    </div>

    <h5 className="text-white mb-1 fw-bold pt-3">Sarah Klein</h5>
    <p className="text-secondary">{t("feedback.client_four.title")}</p>
  </div>

  {/* Testimonial 5 */}
  <div className={`${Style.testimonialCard} p-4 rounded-4`}>
    <h3>{t("feedback.client_five.head")}</h3>
    <p className="text-white pt-3">{t("feedback.client_five.comment")}</p>

    <div className="text-warning">
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
    </div>

    <h5 className="text-white mb-1 fw-bold pt-3">Ahmed Hassan</h5>
    <p className="text-secondary">{t("feedback.client_five.title")}</p>
  </div>

  {/* Testimonial 6 */}
  <div className={`${Style.testimonialCard} p-4 rounded-4`}>
    <h3>{t("feedback.client_six.head")}</h3>
    <p className="text-white pt-3">{t("feedback.client_six.comment")}</p>

    <div className="text-warning">
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
    </div>

    <h5 className="text-white mb-1 fw-bold pt-3">Lucas Meyer</h5>
    <p className="text-secondary">{t("feedback.client_six.title")}</p>
  </div>

  {/* Testimonial 7 */}
  <div className={`${Style.testimonialCard} p-4 rounded-4`}>
    <h3>{t("feedback.client_seven.head")}</h3>
    <p className="text-white pt-3">{t("feedback.client_seven.comment")}</p>

    <div className="text-warning">
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
    </div>

    <h5 className="text-white mb-1 fw-bold pt-3">Emily Johnson</h5>
    <p className="text-secondary">{t("feedback.client_seven.title")}</p>
  </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
        </>
    )
}