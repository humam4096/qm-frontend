import { useEffect, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useMobileDrawer } from '../../../hooks/useMobileDrawer';
import { NavigationBar } from './components/NavigationBar';
import { MobileMenu } from './components/MobileMenu';
import { HeroSection } from './components/HeroSection';

// Lazy load non-critical sections for better initial load performance
const FeaturesSection = lazy(() => import('./components/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const HowItWorksSection = lazy(() => import('./components/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));
const LivePreviewSection = lazy(() => import('./components/LivePreviewSection').then(m => ({ default: m.LivePreviewSection })));
const BenefitsSection = lazy(() => import('./components/BenefitsSection').then(m => ({ default: m.BenefitsSection })));
const CTASection = lazy(() => import('./components/CTASection').then(m => ({ default: m.CTASection })));
const FooterSection = lazy(() => import('./components/FooterSection').then(m => ({ default: m.FooterSection })));

// Lightweight loading fallback
const SectionSkeleton = () => (
  <div className="w-full h-96 bg-muted/20 animate-pulse rounded-2xl" />
);

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
    <div className="min-h-screen-mobile bg-background flex flex-col font-sans transition-colors duration-300">

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

      {/* Hero is critical - load immediately */}
      <HeroSection
        isDarkMode={isDarkMode}
        onLearnMoreClick={(e) => handleSmoothScroll(e, '#how-it-works')}
      />

      {/* Lazy load below-the-fold sections */}
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorksSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <LivePreviewSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <BenefitsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CTASection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FooterSection onNavClick={handleSmoothScroll} />
      </Suspense>
    </div>
  );
};
