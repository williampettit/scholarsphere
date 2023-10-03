// TODO: internationalization (i18n) support for languages
// https://nextjs.org/docs/app/building-your-application/routing/internationalization

type LanguageId =
  | "en"
  | "ar"
  | "de"
  | "es"
  | "fr"
  | "ja"
  | "ko"
  | "pt"
  | "ru"
  | "zh";

type LanguageInfo = {
  label: string;
};

type LanguageMap = {
  [key in LanguageId]: LanguageInfo;
};

export const LANGUAGE_MAP: LanguageMap = {
  en: { label: "English" },
  ar: { label: "Arabic" },
  de: { label: "German" },
  es: { label: "Spanish" },
  fr: { label: "French" },
  ja: { label: "Japanese" },
  ko: { label: "Korean" },
  pt: { label: "Portuguese" },
  ru: { label: "Russian" },
  zh: { label: "Chinese" },
} as const;
