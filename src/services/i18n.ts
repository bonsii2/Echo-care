import om from '../locales/om.json';
import am from '../locales/am.json';
import ti from '../locales/ti.json';
import en from '../locales/en.json';
import { LanguageCode } from '../types';

const translations = { om, am, ti, en };

export const translate = (keyPath: string, lang: LanguageCode = 'om'): string => {
  const dict = translations[lang] || translations.om;
  const keys = keyPath.split('.');
  
  let current: any = dict;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to English or keyPath if missing
      let fallback: any = translations.en;
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return keyPath;
        }
      }
      return typeof fallback === 'string' ? fallback : keyPath;
    }
  }
  
  return typeof current === 'string' ? current : keyPath;
};

export const LANGUAGES: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
  { code: 'om', name: 'Afaan Oromoo', nativeName: 'Afaan Oromoo', flag: '🇪🇹' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇹' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
];
