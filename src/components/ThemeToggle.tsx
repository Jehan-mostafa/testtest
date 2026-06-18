import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = theme === "dark" ? t("Light") : t("Dark");
  const title = theme === "dark" ? t("Switch to light mode") : t("Switch to dark mode");

  return (
    <button
      type="button"
      className="theme-toggle"
      data-i18n-managed="true"
      onClick={() => setTheme(nextTheme)}
      aria-label={title}
      title={title}
    >
      <span className="theme-toggle__icon" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
