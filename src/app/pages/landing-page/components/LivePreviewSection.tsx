import { useTranslation } from 'react-i18next';
import { PreviewCard1, PreviewCard2, PreviewCard3 } from './preview-cards';

export const LivePreviewSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#1a2e1a] dark:bg-[#1a2e1a]">
      {/* Premium Dark Background with Mesh Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f0f] via-[#1a2e1a] to-[#0f1f0f]" />
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(62, 80, 58, 0.3) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(148, 163, 120, 0.3) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(62, 80, 58, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(148, 163, 120, 0.3) 0px, transparent 50%)
        `
      }} />
      
      {/* Animated gradient lines */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            {t('landing.preview.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('landing.preview.subtitle')}
          </p>
        </div>

        {/* Preview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PreviewCard1 t={t} />
          <PreviewCard2 t={t} />
          <PreviewCard3 t={t} />
        </div>
      </div>
    </section>
  );
};
