import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="p-2 border rounded text-sm"
    >
      <option value="en">English</option>
      <option value="te">Telugu</option>
      <option value="hi">Hindi</option>
      <option value="kn">Kannada</option>
    </select>
  );
};

export default LanguageSelector;
