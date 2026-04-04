'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(() => {
    // Initialize from localStorage  
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const applyLanguage = (lang: string) => {
    // Set document direction for RTL languages
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }

    // Store language preference in cookie
    document.cookie = `language=${lang}; path=/; max-age=${30 * 24 * 60 * 60}`;
    
    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  };

  useEffect(() => {
    // Keep document/cookie state synced with selected language
    applyLanguage(currentLang);
  }, [currentLang]);

  const handleLanguageChange = (lang: string | null) => {
    if (!lang) return;
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    
    // Reload page to apply language changes everywhere
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    mounted && (
      <Select value={currentLang || 'en'} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  );
}
