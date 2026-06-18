import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language === "ar" ? "ar" : "en";

  const changeLanguage = (language: "en" | "ar") => {
    localStorage.setItem("language", language);
    i18n.changeLanguage(language);
  };

  return (
    <div className="language-switcher" aria-label={t("Language")}>
      <button
        type="button"
        className={current === "en" ? "active" : ""}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={current === "ar" ? "active" : ""}
        onClick={() => changeLanguage("ar")}
      >
        AR
      </button>
    </div>
  );
}
