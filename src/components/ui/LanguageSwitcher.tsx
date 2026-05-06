import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en-US' ? 'ar' : 'en-US');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
      title="Change Language"
    >
      {i18n.language === 'en-US' ? (
        <>
          <span className="text-base leading-none" role="img" aria-label="Arabic">🇸🇦</span>
          <span className="hidden md:flex">عربي</span>
        </>
      ) : (
        <>
          <span className="text-base leading-none" role="img" aria-label="English">🇬🇧</span>
          <span className="hidden md:flex">EN</span>
        </>
      )}
    </button>
  );
};
