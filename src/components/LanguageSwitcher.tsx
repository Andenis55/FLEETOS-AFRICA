import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4">
      <button onClick={() => changeLanguage('en')} className="mr-2 bg-gray-200 p-2 rounded">
        English
      </button>
      <button onClick={() => changeLanguage('sw')} className="bg-gray-200 p-2 rounded">
        Swahili
      </button>
    </div>
  );
};

export default LanguageSwitcher;