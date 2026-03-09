import en from './en.json';
import it from './it.json';

const translations = { en, it };

export function t(lang, key) {
  const keys = key.split('.');
  let value = translations[lang];
  for (const k of keys) {
    if (value == null) return key;
    value = value[k];
  }
  return value ?? key;
}

export function getOtherLang(lang) {
  return lang === 'it' ? 'en' : 'it';
}
