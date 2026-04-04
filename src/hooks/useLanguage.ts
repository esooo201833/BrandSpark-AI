// src/hooks/useLanguage.ts

'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { getTranslation, type Language, type TranslationKey } from '@/lib/translations';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    return (localStorage.getItem('language') as Language) || 'en';
  });

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    // Apply language to document
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.cookie = `language=${newLang}; path=/; max-age=${30 * 24 * 60 * 60}`;
    
    if (newLang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = newLang;
    }
  };

  return {
    language,
    t,
    changeLanguage,
    isArabic: language === 'ar',
    isRTL: language === 'ar',
    mounted,
  };
}
