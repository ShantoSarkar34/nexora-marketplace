export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
};

export interface Dictionary {
  nav: {
    browseJobs: string;
    findTalent: string;
    about: string;
    login: string;
    signup: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      browseJobs: "Browse Jobs",
      findTalent: "Find Talent",
      about: "About",
      login: "Log in",
      signup: "Sign up",
    },
  },
  bn: {
    nav: {
      browseJobs: "কাজ ব্রাউজ করুন",
      findTalent: "ট্যালেন্ট খুঁজুন",
      about: "সম্পর্কে",
      login: "লগ ইন",
      signup: "সাইন আপ",
    },
  },
};