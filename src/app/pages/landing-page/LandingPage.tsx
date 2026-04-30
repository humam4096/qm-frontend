import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMobileDrawer } from '../../../hooks/useMobileDrawer';
import { NavigationBar } from './components/NavigationBar';
import { MobileMenu } from './components/MobileMenu';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { LivePreviewSection } from './components/LivePreviewSection';
import { BenefitsSection } from './components/BenefitsSection';
import { CTASection } from './components/CTASection';
import { FooterSection } from './components/FooterSection';

export const LandingPage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { isOpen: isMenuOpen, open: openMenu, close: closeMenu, triggerRef } = useMobileDrawer();
  
  // Detect theme for dashboard image
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Close mobile menu if open
    if (isMenuOpen) {
      closeMenu();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300">

      <NavigationBar
        onMenuClick={openMenu}
        onNavClick={handleSmoothScroll}
        triggerRef={triggerRef as React.RefObject<HTMLButtonElement>}
        isMenuOpen={isMenuOpen}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        isRtl={isRtl}
        onNavClick={handleSmoothScroll}
      />

      <HeroSection
        isDarkMode={isDarkMode}
        onLearnMoreClick={(e) => handleSmoothScroll(e, '#how-it-works')}
      />

      <FeaturesSection />

      <HowItWorksSection />

      <LivePreviewSection />

      <BenefitsSection />

      <CTASection />

      <FooterSection onNavClick={handleSmoothScroll} />
    </div>
  );
};
