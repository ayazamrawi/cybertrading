import react, { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useSearchParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import Counter from "../Counter/Counter";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";

export default function Layout(){
    const [params] = useSearchParams();

  useEffect(() => {
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("affiliate_ref", ref);
    }
  }, [params]);

    return<>
    <Counter/>
    <Navbar/>
    <ScrollToTop />
    <Outlet></Outlet>
    <ScrollToTopButton/>
    <Footer/>
    </>
}