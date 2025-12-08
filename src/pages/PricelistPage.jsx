import { useEffect, useState } from "react";
import { getPriceList, getUiTexts, updatePriceItem } from "../services/api";
import "../styles/pricelist.css";
import diamond from "../assets/diamond.png";
import en from "../assets/en.png";
import se from "../assets/se.png";

function PriceListPage() {
  const [lang, setLang] = useState("en");
  const [texts, setTexts] = useState({});
  const [items, setItems] = useState([]);
  const [loadingTexts, setLoadingTexts] = useState(true);
  const [textErrors, setTextErrors] = useState("");

  const [rows, setRows] = useState([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [rowsError, setRowsError] = useState("");

  const [savingMap, setSavingMap] = useState({});

  useEffect(() => {
    async function load() {
      try {
        setLoadingTexts(true);
        setTextErrors("");
        setRowsLoading(true);
        setRowsError("");

        const [ui, data] = await Promise.all([
          getUiTexts("pricelist", lang),
          getPriceList(),
        ]);

        setTexts(ui.texts || {});
        setRows(data || []);
      } catch (error) {
        setRowsError(error.message || "Failed to load pricelist!");
        setTextErrors(error.message || "Failed to load texts!");
      } finally {
        setLoadingTexts(false);
        setRowsLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(id, field, value) {
    setItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  async function handleBlur(id) {
    const row = rows.find((r) => r.id === id);

    if (!row) {
      return;
    }

    setSavingMap((prev) => ({ ...prev, [id]: true }));

    try {
      const body = {
        item_code: row.item_code,
        name: row.name,
        in_price: row.in_price,
        price: row.price,
        currency: row.currency,
        vat_percent: row.vat_percent,
        is_active: row.is_active,
      };

      const updated = await updatePriceItem(id, body);

      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      );
    } catch (error) {
      alert(error.message || "Failed saving.");
    } finally {
      setSavingMap((prev) => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="pricelist-page">
      <aside className="pl-sidebar">
        <div className="pl-sidebar-inner">
          <div className="pl-user">
            <img src={diamond} />
            <div className="pl-user-info">
              <div className="pl-user-name">Saurav Banerjee</div>
              <div className="pl-user-company">Storfjord AS</div>
            </div>
          </div>

          <nav className="pl-menu">
            <ul>
              <li className="muted">Menu</li>
              <li>{texts.invoice}</li>
              <li>{texts.customers}</li>
              <li>{texts.business}</li>
              <li>{texts.journal}</li>
              <li>{texts.priceList}</li>
              <li>{texts.invoicing}</li>
              <li>{texts.unpaid_invoices}</li>
              <li>{texts.offer}</li>
              <li>{texts.inventory_control}</li>
              <li>{texts.import_export}</li>
              <li>{texts.logout}</li>
            </ul>
          </nav>
        </div>
      </aside>

      <div className="pl-main-area">
        <header className="pl-topbar">
          <div className="pl-topbar-left">
            <button className="pl-hamburger">☰</button>
            <div className=""></div>
          </div>
        </header>
        <div className="pl-action-pills">
          <button className="pill">{texts.new_product}</button>
          <button className="pill">{texts.print_list}</button>
          <button className="pill">{texts.advanced_mode}</button>
        </div>
      </div>
    </div>
  );
}

export default PriceListPage;
