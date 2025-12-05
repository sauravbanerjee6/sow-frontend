import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUiTexts } from "../services/api.js";
import "../styles/login.css";

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
      {/* Language Switch */}
      <div className="lang-switcher">
        <button
          type="button"
          className={lang === "en" ? "active" : ""}
          onClick={() => setLang("en")}
        >
          EN
        </button>
        <button
          type="button"
          className={lang === "sv" ? "active" : ""}
          onClick={() => setLang("sv")}
        >
          SV
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {loadingTexts ? <h1>...</h1> : <h1>{texts.title || "Log in"}</h1>}
        {textErrors && <div className="error">{textErrors}</div>}

        <label>
          {texts.email_label || "Email"}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </label>

        <label>
          {texts.password_label || "Password"}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>

        {loginError && <div className="error">{loginError}</div>}

        <button type="submit" disabled={loginLoading}>
          {loginLoading ? "..." : texts.login_button || "Log in"}
        </button>
      </form>

      <footer className="login-footer">
        <div className="footer-line-row">
          <div className="footer-left">
            {loadingTexts ? "..." : texts.footer_title}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
