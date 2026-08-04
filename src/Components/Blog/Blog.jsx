import React from 'react';
import Style from './Blog.module.css';

import { useTranslation } from "react-i18next";
export default function Blog() {
    const { t } = useTranslation();
    return (
        <>
            <main className={Style.main}>
                <div className="container">
                    <div className={`${Style.mainHead} d-flex align-items-center justify-content-center text-center`}>
                        <div>
                            <div className={`${Style.headContent} ps-5`}>
                                <h1 className={`h6 ${Style.heading}`}>{t("blog.hero.title")}</h1>
                                <br />
                                <h2>
                                    <span>{t("blog.hero.subtitle")}</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section className={Style.blogCyber}>
                <div className="container">
                    <div className="d-flex gap-5 flex-column">
                        <div className="w-75 m-auto">
                            <h2>{t("blog.sections.what.title")}</h2>
                            <br />
                            <p>{t("blog.sections.what.text")}</p>

                        </div>

                        <div className="w-75 m-auto pt-5">
                            <h2>{t("blog.sections.why.title")}</h2>
                            <br />
<p>{t("blog.sections.why.text")}</p>
                        </div>

                        <div className="w-75 m-auto pt-5">
                           <h2>{t("blog.sections.vision.title")}</h2>
                           <br />
<p>{t("blog.sections.vision.text")}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}