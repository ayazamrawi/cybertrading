import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import Style from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation();

    return (
        <ul className={`${Style.dropdownMenu}`}>
            <li>
                <a 
                    className={`${Style.dropdownItem} ${language === 'en' ? Style.active : ''}`}
                    onClick={() => changeLanguage('en')}
                    style={{ cursor: 'pointer' }}
                >
                    🇬🇧 {t("nav.lang.en")}
                </a>
            </li>
            <li>
                <a 
                    className={`${Style.dropdownItem} ${language === 'de' ? Style.active : ''}`}
                    onClick={() => changeLanguage('de')}
                    style={{ cursor: 'pointer' }}
                >
                    🇩🇪 {t("nav.lang.de")}
                </a>
            </li>
            <li>
                <a 
                    className={`${Style.dropdownItem} ${language === 'ar' ? Style.active : ''}`}
                    onClick={() => changeLanguage('ar')}
                    style={{ cursor: 'pointer' }}
                >
                    🇪🇬 {t("nav.lang.ar")}
                </a>
            </li>
        </ul>
    );
};

export default LanguageSwitcher;