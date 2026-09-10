import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { copy, type Copy, type Locale } from "./i18n";
import { localeFromPathname } from "./routing";

type LocaleContextValue = {
  locale: Locale;
  t: Copy;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const locale = localeFromPathname(pathname);

  useEffect(() => {
    document.documentElement.lang = locale === "el" ? "el" : "en";
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
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
