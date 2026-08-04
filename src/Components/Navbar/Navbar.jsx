import React, { useState, useEffect } from 'react';
import Style from './Navbar.module.css';
import logo from '../../Assets/Images/cyber2.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../Context/LanguageContext';



export default function Navbar() {
    const { i18n , t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user, admin, affiliate, isAuthenticated, logoutUser, logoutAdmin, logoutAffiliate } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // للتعرف على تغيير الصفحة
    const { language, changeLanguage } = useLanguage();
    // 🔥 إغلاق الـ sidenav تلقائياً عند تغيير الصفحة
    useEffect(() => {
        setIsOpen(false); // قفل الـ sidenav
        setShowDropdown(false); // قفل الـ dropdown
    }, [location.pathname]); // كل ما الصفحة تتغير

    const handleLogout = () => {
        setShowDropdown(false);
        setIsOpen(false); // قفل الـ sidenav
        if (user) {
            logoutUser();
            navigate('/login');
        } else if (admin) {
            logoutAdmin();
            navigate('/login');
        } else if (affiliate) {
            logoutAffiliate();
            navigate('/affiliatesLogin');
        }
    };

    const getDashboardLink = () => {
        if (user && user.role === 'admin') return '/adminDashboard';
        if (admin) return '/adminDashboard';
        if (user) return '/userDashboard';
        if (affiliate) return '/affiliateDashboard';
        return '/';
    };

    const getUserName = () => {
        if (user) return user.name;
        if (admin) return admin.name;
        if (affiliate) return affiliate.name;
        return 'Guest';
    };

    const handleToggle = () => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    };

    const closeSidenav = () => {
        setIsOpen(false);
        window.scrollTo({top:0,behavior:'smooth'})
    };

    const sidenavStyle = {
        width: isOpen ? '100%' : '0',
    };
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navbarClass = `${Style.navbar} navbar navbar-expand-lg ${isScrolled ? Style.scrolled : ''}`;

    return (
        <>
            {/* Main Navbar */}
            <nav className={navbarClass} id="main-nav">
                <div className="container">
                    {/* Logo - Desktop */}
                    <Link to={'/'} className={`navbar-brand d-none d-lg-flex align-items-end ${Style.forceLtr}`}>
                        <img src={logo} alt="CyberPips Logo" width='30%' />
                        <span className={`${Style.logoSpan}`}>Cyber Pips</span>
                    </Link>

                    {/* Mobile Toggle Button */}
                    <button
                        className={`toggleBtn ${Style.navbarToggler} navbar-toggler`}
                        onClick={handleToggle}
                        aria-expanded={isOpen}
                        aria-controls="mySidenav"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    {/* Logo - Mobile */}
                    <Link className={`${Style.navbarToggler} navbar-toggler ${Style.forceLtr}`} to={'/'}>
                        <div className='d-flex align-items-end justify-content-start'>
                            <img src={logo} alt="CyberPips Logo" width='30%' />
                            <span className={`${Style.logoSpan} pb-1 `}>Cyber Pips</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto gap-3 mb-2 mb-lg-0">
                            <li className={`${Style.navItem}`}>
                                <Link to={'/'} className={Style.navLink}>
  {t("nav.home")}
</Link>
                            </li>
                            {/* Features Dropdown */}
                            {/* <li className={`${Style.dropdown} ${Style.navItem}`}>
                               <a className={`${Style.navLink} ${Style.menuTitle}`}>
  {t("nav.features")}
</a>
                            </li> */}

                            {/* Resources Dropdown */}
                            <li className={`${Style.dropdown} ${Style.navItem}`}>
                               <a className={`${Style.navLink} ${Style.menuTitle}`}>
  {t("nav.resources")}
</a>
                                <ul className={`${Style.dropdownMenu}`} aria-labelledby="ResourcesMenu">
    <li><Link className={Style.dropdownItem} to="docs">{t("nav.docs")}</Link></li>
    <li><Link className={Style.dropdownItem} to="blog">{t("nav.blog")}</Link></li>
    <li><Link className={Style.dropdownItem} to="about">{t("nav.about")}</Link></li>
    <li><Link className={Style.dropdownItem} to="community">{t("nav.community")}</Link></li>
    <li><Link className={Style.dropdownItem} to="affiliates">{t("nav.affiliates")}</Link></li>
</ul>
                            </li>

                            {/* Library */}
                            <li className={`${Style.navItem}`}>
                                <Link  to={'/library'} className={Style.navLink}>
  {t("nav.library")}
</Link>
                            </li>

                            {/* Pricing */}
                            <li>
                           <Link to="/Pricing" className={Style.navLink}>
  {t("nav.pricing")}
</Link>
</li>

                            {/* Language Dropdown */}
                            <li className={`${Style.navItem} ${Style.dropdown}`}>
                                <a className={`${Style.navLink} ${Style.menuTitle}`}>
  {t("nav.language")}  <i className="fa-solid fa-globe"></i>
</a>
                                <ul className={`${Style.dropdownMenu}`}>
    <li>
        <a 
            className={`${Style.dropdownItem}`} 
            onClick={() => changeLanguage("en")}
            style={{ cursor: 'pointer' }}
        >
            {t("nav.lang.en")}
        </a>
    </li>
    <li>
        <a 
            className={`${Style.dropdownItem}`} 
            onClick={() => changeLanguage("de")}
            style={{ cursor: 'pointer' }}
        >
            {t("nav.lang.de")}
        </a>
    </li>
    <li>
        <a 
            className={`${Style.dropdownItem}`} 
            onClick={() => changeLanguage("ar")}
            style={{ cursor: 'pointer' }}
        >
            {t("nav.lang.ar")}
        </a>
    </li>
</ul>
                            </li>

                            {/* Authentication Section */}
                            {!isAuthenticated ? (
                                <>
                                    <li className={`${Style.navItem}`}>
                                        <Link to="/login" className={Style.navLink}>
  {t("nav.login")}
</Link>
                                    </li>
                                    <li className={`${Style.navItem}`}>
                                        <Link to="/register" className={Style.navLink}>
  {t("nav.signup")}
</Link>
                                    </li>
                                </>
                            ) : (
                                <li className={`${Style.navItem} d-flex align-item-center ${Style.dropdown} ${Style.userDropdown}`}>
                                    <a 
                                        className={`${Style.navLink} ${Style.userButton}`}
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {getUserName()} <i class="fa-regular fa-user"></i> <span className={Style.dropdownArrow}>▼</span>
                                    </a>
                                    {showDropdown && (
                                        <ul className={`${Style.dropdownMenu} ${Style.userDropdownMenu}`}>
                                            <li>
                                                <Link
                                                    to={getDashboardLink()}
                                                    className={`${Style.dropdownItem}`}
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    {t("nav.profile")}
                                                </Link>
                                            </li>
                                            <li>
                                                <a
                                                    className={`${Style.dropdownItem}`}
                                                    onClick={handleLogout}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {t("nav.logout")}
                                                </a>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidenav */}
            <div className={`${Style.sidenav} ${isOpen ? Style.open : ""}`} id="mySidenav" style={sidenavStyle}>
                {isOpen && (
                    <button 
                        className={`${Style.navbarToggler} ps-4 mt-2 ${Style.closeBtn} navbar-toggler toggleBtn`} 
                        onClick={closeSidenav} 
                        aria-controls="mySidenav" 
                        id="toggleclosebtn"
                    >
                        <i className={`fa-solid fa-xmark`}></i>
                    </button>
                )}

                <ul className={Style.ulSidenav}>
                    {/* Features */}
                    {/* <li className={`${Style.navItem} ${Style.menuItem}`}>
                        <a className={`${Style.navLink} ${Style.menuTitle}`}>
                           {t("nav.features")}
                        </a>
                    </li> */}

                    {/* Resources */}
                    <li className={`${Style.navItem} ${Style.menuItem}`}>
                        <a className={`${Style.navLink} ${Style.menuTitle}`}>
                            {t("nav.resources")}
                        </a>
                        <ul className={`${Style.submenu}`}>
                            <li><Link className={`${Style.dropdownItem}`} to={'docs'}>{t("nav.docs")}</Link></li>
                            <li><Link className={`${Style.dropdownItem}`} to={'blog'}>{t("nav.blog")}</Link></li>
                            <li><Link className={`${Style.dropdownItem}`} to={'about'}>{t("nav.about")}</Link></li>
                            <li><Link className={`${Style.dropdownItem}`} to={'community'}>{t("nav.community")}</Link></li>
                            <li><Link className={`${Style.dropdownItem}`} to={'affiliates'}>{t("nav.affiliates")}</Link></li>
                        </ul>
                    </li>

                    {/* Library */}
                    <li className={`${Style.navItem}`}>
                        <Link to={'/library'} className={`${Style.navLink}`}>
                             {t("nav.library")}
                        </Link>
                    </li>

                    {/* Pricing */}
                    <li className={`${Style.navItem}`}>
                        <Link to={'/Pricing'} className={`${Style.navLink}`}>
                            {t("nav.pricing")}
                        </Link>
                    </li>

                    {/* Language */}
                    <li className={`${Style.navItem} ${Style.menuItem}`}>
                    <a className={`${Style.navLink} ${Style.menuTitle}`}>
                        {t("nav.language")}
                    </a>
                    <ul className={`${Style.submenu}`}>
                        <li>
                        <a
                            className={`${Style.dropdownItem}`}
                            onClick={() => {
                            changeLanguage("en");
                            closeSidenav();
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            {t("nav.lang.en")}
                        </a>
                        </li>
                        <li>
                        <a
                            className={`${Style.dropdownItem}`}
                            onClick={() => {
                            changeLanguage("de");
                            closeSidenav();
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            {t("nav.lang.de")}
                        </a>
                        </li>
                        <li>
                        <a
                            className={`${Style.dropdownItem}`}
                            onClick={() => {
                            changeLanguage("ar");
                            closeSidenav();
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            {t("nav.lang.ar")}
                        </a>
                        </li>
                    </ul>
                    </li>

                    {/* Authentication Section for Mobile */}
                    {!isAuthenticated ? (
                        <>
                            <li className={`${Style.navItem}`}>
                                <Link to={'/login'} className={`${Style.navLink}`}>
                                    {t("nav.login")}
                                </Link>
                            </li>
                            <li className={`${Style.navItem}`}>
                                <Link to={'/register'} className={`${Style.navLink}`}>
                                    {t("nav.signup")}
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={`${Style.navItem}`}>
                                <Link to={getDashboardLink()} className={`${Style.navLink}`}>
                                    {t("nav.profile")}  <i class="fa-regular fa-user"></i>
                                </Link>
                            </li>
                            <li className={`${Style.navItem}`}>
                                <a className={`${Style.navLink}`} onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                    {t("nav.logout")}
                                </a>
                            </li>
                            <li className={`${Style.navItem}`}>
                                <a className={`${Style.navLink}`} style={{ fontSize: '3vh', opacity: 0.7 }}>
                                    {t("nav.welcome", { name: getUserName() })}!
                                </a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
}