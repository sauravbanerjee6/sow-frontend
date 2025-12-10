import { useEffect, useState } from "react";
import { getTerms, getUiTexts } from "../services/api";
import "../styles/terms.css";
import diamond from "../assets/diamond.png";
import en from "../assets/en.png";
import se from "../assets/se.png";
import { useNavigate } from "react-router-dom";

function TermsPage() {
  const [lang, setLang] = useState("en");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [texts, setTexts] = useState({});
  const [loadingTexts, setLoadingTexts] = useState(true);
  const [textErrors, setTextErrors] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLangListOpen, setIsLangListOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentFlag = lang === "en" ? en : se;
  const currentLangLabel = texts.language_label;

  const navigate = useNavigate();

  useEffect(() => {
    async function loadTerms() {
      setLoading(true);
      setError("");

      try {
        const data = await getTerms(lang);
        setContent(data.content || "");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTerms();
  }, [lang]);

  useEffect(() => {
    async function loadTexts() {
      setLoadingTexts(true);
      setTextErrors("");
      try {
        const data = await getUiTexts("terms", lang);
        setTexts(data.texts || {});
      } catch (err) {
        setTextErrors(err);
      } finally {
        setLoadingTexts(false);
      }
    }

    loadTexts();
  }, [lang]);

  return (
    <div className="terms-page">
      <header className="terms-header">
        <div className="terms-header-left">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          <img src={diamond} className="terms-header-logo" />
        </div>

        <div className="terms-header-right">
          <div className="terms-header-buttons">
            <button className="terms-header-right-button">
              {texts.home_button}
            </button>

            <button className="terms-header-right-button">
              {texts.order_button}
            </button>

            <button className="terms-header-right-button">
              {texts.customer_button}
            </button>

            <button className="terms-header-right-button">
              {texts.aboutUs_button}
            </button>

            <button className="terms-header-right-button">
              {texts.contactUs_button}
            </button>
          </div>

          <div className="language-dropdown">
            <button
              type="button"
              className="language-toggle"
              onClick={() => setIsLangListOpen((prev) => !prev)}
            >
              <span className="language-label">{currentLangLabel}</span>
              <span className="language-label-caret">▾</span>
              <img src={currentFlag} className="language-flag" />
            </button>

            {isLangListOpen && (
              <div className="language-menu">
                <button
                  type="button"
                  className="language-menu-item"
                  onClick={() => {
                    setLang("sv");
                    setIsLangListOpen(false);
                  }}
                >
                  <span>Svenska</span>
                  <img src={se} className="language-flag" />
                </button>
                <button
                  type="button"
                  className="language-menu-item"
                  onClick={() => {
                    setLang("en");
                    setIsLangListOpen(false);
                  }}
                >
                  <span>English</span>
                  <img src={en} className="language-flag" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="mobile-menu">
          <button className="terms-header-right-button">
            {texts.home_button}
          </button>

          <button className="terms-header-right-button">
            {texts.order_button}
          </button>

          <button className="terms-header-right-button">
            {texts.customer_button}
          </button>

          <button className="terms-header-right-button">
            {texts.aboutUs_button}
          </button>

          <button className="terms-header-right-button">
            {texts.contactUs_button}
          </button>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="terms-content">
          <h1 className="terms-label">{texts.terms_label}</h1>
          <button className="back-button" onClick={() => navigate(-1)}>
            {texts.back_button_text}
          </button>

          <div className="terms-text">
            {content.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          <button className="back-button" onClick={() => navigate(-1)}>
            {texts.back_button_text}
          </button>
        </div>
      )}
    </div>
  );
}

export default TermsPage;
