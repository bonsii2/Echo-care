import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { StorageService } from '../services/storage';
import { translate } from '../services/i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (keyPath: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('om');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    StorageService.getLanguage().then((savedLang) => {
      setLanguageState(savedLang);
      setIsLoading(false);
    });
  }, []);

  const changeLanguage = async (newLang: LanguageCode) => {
    setLanguageState(newLang);
    await StorageService.saveLanguage(newLang);
  };

  const t = (keyPath: string): string => {
    return translate(keyPath, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
