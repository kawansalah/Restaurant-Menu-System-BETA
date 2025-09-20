import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ku' | 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Helper function to determine direction based on language
const getDirection = (language: Language): Direction => {
  switch (language) {
    case 'ku':
    case 'ar':
      return 'rtl';
    case 'en':
    default:
      return 'ltr';
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first for persisted language
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ku', 'ar', 'en'].includes(savedLanguage)) {
      return savedLanguage;
    }
    // Default to Kurdish
    return 'ku';
  });
  
  const direction = getDirection(language);
  const isRTL = direction === 'rtl';

  useEffect(() => {
    // Apply direction to body element
    document.body.dir = direction;
    
    // Apply direction to html element as well for better compatibility
    document.documentElement.dir = direction;
    
    // Add language class to body for additional styling if needed
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, '');
    document.body.classList.add(`lang-${language}`);
    
    // Store language in localStorage for persistence
    localStorage.setItem('language', language);
  }, [language, direction]);

  const value = {
    language,
    direction,
    setLanguage,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 