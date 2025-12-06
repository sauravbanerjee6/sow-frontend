import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUiTexts } from "../services/api.js";
import "../styles/login.css";
import showPasswordIcon from "../assets/show_password.png";
import hidePasswordIcon from "../assets/hide_password.png";
import diamond from "../assets/diamond.png";
import en from "../assets/en.png";
import se from "../assets/se.png";

function LoginPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const [texts, setTexts] = useState({});
  const [loadingTexts, setLoadingTexts] = useState(true);
  const [textErrors, setTextErrors] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLangListOpen, setIsLangListOpen] = useState(false);

  const currentFlag = lang === "en" ? en : se;
  const currentLangLabel = texts.language_label;

  useEffect(() => {
    async function loadTexts() {
      setLoadingTexts(true);
      setTextErrors("");
      try {
        const data = await getUiTexts("login", lang);
        setTexts(data.texts || {});
      } catch (err) {
        setTextErrors(err);
      } finally {
        setLoadingTexts(false);
      }
    }

    loadTexts();
  }, [lang]);

  async function handleSubmit(e) {
    e.preventDefault();
    // setLoginError("");
    // setLoginLoading(true);
    console.log(email);

    // try {
    //     const data = await login(email,password);
    //     saveToken
    // } catch (error) {

    // }
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-header-login">
          <img src={diamond} className="login-header-logo" />
        </div>

        <div className="login-header-right">
          <button className="login-header-right-button">
            {texts.home_button}
          </button>

          <button className="login-header-right-button">
            {texts.order_button}
          </button>

          <button className="login-header-right-button">
            {texts.customer_button}
          </button>

          <button className="login-header-right-button">
            {texts.aboutUs_button}
          </button>

          <button className="login-header-right-button">
            {texts.contactUs_button}
          </button>

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

      <div className="login-content">
        <form className="login-form" onSubmit={handleSubmit}>
          {loadingTexts ? (
            <h1>...</h1>
          ) : (
            <h1 className="form-title">{texts.title || "Log in"}</h1>
          )}
          {textErrors && <div className="error">{textErrors}</div>}

          <div className="form-inner">
            <label className="form-field">
              {texts.email_label || "Email"}
              <input
                type="email"
                value={email}
                placeholder={texts.email_hint}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </label>

            <label className="form-field">
              {texts.password_label || "Password"}
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder={texts.password_hint}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? showPasswordIcon : hidePasswordIcon}
                    className="password-icon"
                  ></img>
                </button>
              </div>
            </label>

            {loginError && <div className="error">{loginError}</div>}

            <button
              type="submit"
              disabled={loginLoading}
              className="form-submit-button"
            >
              {loginLoading ? "..." : texts.login_button || "Log in"}
            </button>

            <div className="form-footer">
              <button className="form-footer-button">
                {texts.register_button}
              </button>

              <button className="form-footer-button">
                {texts.forgot_password}
              </button>
            </div>
          </div>
        </form>
      </div>

      <footer className="login-footer">
        <div className="login-footer-line-row">
          <div className="login-footer-left">
            {loadingTexts ? "..." : texts.footer_title}
          </div>
          <div className="login-footer-right">
            <button className="login-footer-right-button">
              {texts.home_button}
            </button>
            <button className="login-footer-right-button">
              {texts.order_button}
            </button>
            <button className="login-footer-right-button">
              {texts.contactUs_button}
            </button>
          </div>
        </div>

        <div className="login-footer-divider"></div>

        <div className="copyright">{texts.footer_content}</div>
      </footer>
    </div>
  );
}

export default LoginPage;
