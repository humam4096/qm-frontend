import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const container = document.querySelector('[data-scroll-container]');
    
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "auto", 
      });
    }
  }, [pathname]);

  return null;
};