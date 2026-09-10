import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { copy, type Copy, type Locale } from "./i18n";

const STORAGE_KEY = "omnidot-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Copy;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "el") return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "el" ? "el" : "en";
    document.title = copy[locale].metaTitle;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", copy[locale].metaDescription);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: copy[locale],
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
