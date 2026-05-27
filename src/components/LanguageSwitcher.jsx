import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'az', label: 'AZ', flag: '🇦🇿' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'tr', label: 'TR', flag: '🇹🇷' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      {languages.map((lng, index) => (
        <React.Fragment key={lng.code}>
          <button
            onClick={() => changeLanguage(lng.code)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-sm ${
              i18n.language === lng.code 
                ? 'bg-primary/20 text-primary-dark font-bold' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title={lng.label}
          >
            <span className="text-lg leading-none">{lng.flag}</span>
            <span className="hidden sm:inline">{lng.label}</span>
          </button>
          {index < languages.length - 1 && (
            <span className="text-slate-600 hidden sm:inline">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
