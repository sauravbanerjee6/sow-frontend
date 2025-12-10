import { useEffect, useState } from "react";
import { getUiTexts, getPriceList, updatePriceItem } from "../services/api";
import "../styles/pricelist.css";
import avatar from "../assets/avatar.png";
import en from "../assets/en.png";
import se from "../assets/se.png";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function PricelistPage() {
  const [lang, setLang] = useState("en");
  const [texts, setTexts] = useState({});
  const [loadingTexts, setLoadingTexts] = useState(true);
  const [textErrors, setTextErrors] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [rowsError, setRowsError] = useState("");
  const [savingMap, setSavingMap] = useState({});
  const [filteredRows, setFilteredRows] = useState([]);
  const [articleQuery, setArticleQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoadingTexts(true);
      setTextErrors("");
      setRowsLoading(true);
      setRowsError("");
      try {
        const [uiResp, listResp] = await Promise.all([
          getUiTexts("pricelist", lang),
          getPriceList(),
        ]);
        setTexts(uiResp.texts || {});
        setRows(listResp.data || []);
      } catch (err) {
        const msg = err && err.message ? err.message : "Failed to load data";
        setTextErrors(msg);
        setRowsError(msg);
      } finally {
        setLoadingTexts(false);
        setRowsLoading(false);
      }
    }
    load();
  }, [lang]);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  function handleSearch(e) {
    e.preventDefault();
    const articleQ = articleQuery.trim().toLowerCase();
    const productQ = productQuery.trim().toLowerCase();
    let filtered = rows;
    if (articleQ) {
      filtered = filtered.filter((r) =>
        (r.item_code || "").toString().toLowerCase().includes(articleQ)
      );
    }
    if (productQ) {
      filtered = filtered.filter((r) =>
        (r.name || "").toString().toLowerCase().includes(productQ)
      );
    }
    setFilteredRows(filtered);
  }

  function handleNewProduct() {
    alert("New Product");
  }

  function handlePrintList() {
    window.print();
  }

  function handleAdvancedMode() {
    alert("Advanced Mode");
  }

  function handleChange(id, field, value) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
    setFilteredRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  async function handleBlur(id) {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setSavingMap((s) => ({ ...s, [id]: true }));
    try {
      const payload = {
        item_code: row.item_code,
        name: row.name,
        in_price: row.in_price,
        price: row.price,
        unit: row.unit,
        in_stock: row.in_stock,
        description: row.description,
      };
      const updated = await updatePriceItem(id, payload);
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      );
      setFilteredRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      );
    } catch (err) {
      console.error("Save failed:", err);
      alert(err.message || "Failed to save item");
    } finally {
      setSavingMap((s) => ({ ...s, [id]: false }));
    }
  }

  function openSidebar() {
    setSidebarOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    setSidebarOpen(false);
    document.body.style.overflow = "";
  }

  return (
    <div className="pricelist-page">
      <header className="pricelist-header">
        <div className="pricelist-header-left">
          <button
            className="menu-btn"
            onClick={openSidebar}
            aria-label="Open menu"
          >
            ☰
          </button>
          <img
            src={avatar}
            className="pricelist-header-avater"
            alt="User avatar"
          />
          <div className="pricelist-header-user">
            <div className="pricelist-header-name">John Andre</div>
            <div className="pricelist-header-company">Storfjord AS</div>
          </div>
        </div>

        <div className="pricelist-header-right">
          <span className="pricelist-header-language">{lang}</span>
          <img
            src={lang === "en" ? en : se}
            className="pricelist-header-flag"
            alt="Language flag"
          />
        </div>
      </header>

      <div className="pricelist-content">
        <aside className={`pricelist-sidebar ${sidebarOpen ? "open" : ""}`}>
          <button
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ✕
          </button>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-title desktop-only">
              {texts.menu_title || "MENU"}
            </li>
            <li className="desktop-only">{texts.invoices || "Invoices"}</li>
            <li className="desktop-only">{texts.customers || "Customers"}</li>
            <li className="desktop-only">
              {texts.my_business || "My Business"}
            </li>
            <li className="desktop-only">
              {texts.invoice_journal || "Invoice Journal"}
            </li>
            <li className="active desktop-only">
              {texts.price_list || "Price List"}
            </li>
            <li className="desktop-only">
              {texts.multiple_invoicing || "Multiple Invoicing"}
            </li>
            <li className="desktop-only">
              {texts.unpaid_invoices || "Unpaid Invoices"}
            </li>
            <li className="desktop-only">{texts.offer || "Offer"}</li>
            <li className="desktop-only">
              {texts.inventory_control || "Inventory Control"}
            </li>
            <li className="desktop-only">
              {texts.member_invoicing || "Member Invoicing"}
            </li>
            <li className="desktop-only">
              {texts.import_export || "Import/Export"}
            </li>
            <li
              className="mobile-only"
              onClick={() => {
                navigate("/terms");
                closeSidebar();
              }}
            >
              Terms
            </li>
            <li
              className="mobile-only"
              onClick={() => {
                logout();
                closeSidebar();
              }}
            >
              {texts.logout || "Log out"}
            </li>
          </ul>
        </aside>

        <div
          className="pricelist-main"
          onClick={() => sidebarOpen && closeSidebar()}
        >
          <div className="pricelist-toolbar">
            <div className="pricelist-searchfields">
              <form className="pricelist-search-input" onSubmit={handleSearch}>
                <div className="pricelist-search-field">
                  <input
                    type="search"
                    placeholder={
                      texts.search_article_placeholder || "Search Article No."
                    }
                    value={articleQuery}
                    onChange={(e) => setArticleQuery(e.target.value)}
                    aria-label="Search Article Number"
                  />
                  <button
                    type="submit"
                    className="pricelist-search-button"
                    aria-label="Search article"
                  >
                    🔍
                  </button>
                </div>

                <div className="pricelist-search-field">
                  <input
                    type="search"
                    placeholder={
                      texts.search_product_placeholder || "Search Product ..."
                    }
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    aria-label="Search Product Name"
                  />
                  <button
                    type="submit"
                    className="pricelist-search-button"
                    aria-label="Search product"
                  >
                    🔍
                  </button>
                </div>
              </form>
            </div>

            <div className="pricelist-action-buttons">
              <button
                type="button"
                className="action-button"
                onClick={handleNewProduct}
              >
                {texts.new_product || "New Product"}
              </button>
              <button
                type="button"
                className="action-button"
                onClick={handlePrintList}
              >
                {texts.print_list || "Print List"}
              </button>
              <button
                type="button"
                className="action-button"
                onClick={handleAdvancedMode}
              >
                {texts.advanced_mode || "Advanced mode"}
              </button>
            </div>
          </div>

          <div className="pricelist-table-container">
            {rowsLoading && <div className="pricelist-status">Loading...</div>}
            {rowsError && !rowsLoading && (
              <div className="pricelist-status-error">{rowsError}</div>
            )}
            {!rowsLoading && !rowsError && filteredRows.length === 0 && (
              <div className="pricelist-empty">
                No items found.{" "}
                {articleQuery || productQuery
                  ? "Try adjusting your search."
                  : ""}
              </div>
            )}

            {!rowsLoading && !rowsError && filteredRows.length > 0 && (
              <>
                <div className="pricelist-table-header">
                  <div className="pricelist-table-header-cell"></div>
                  <div className="pricelist-table-header-cell sortable">
                    Article No. <span className="sort-icon">↓</span>
                  </div>
                  <div className="pricelist-table-header-cell sortable">
                    Product/Service <span className="sort-icon">↓</span>
                  </div>
                  <div className="pricelist-table-header-cell">In Price</div>
                  <div className="pricelist-table-header-cell">Price</div>
                  <div className="pricelist-table-header-cell">Unit</div>
                  <div className="pricelist-table-header-cell">In Stock</div>
                  <div className="pricelist-table-header-cell">Description</div>
                  <div className="pricelist-table-header-cell"></div>
                </div>

                {filteredRows.map((row) => (
                  <div className="pricelist-row" key={row.id}>
                    <div className="col-arrow-col">➜</div>
                    <div className="col-article-col">
                      <input
                        value={row.item_code || ""}
                        onChange={(e) =>
                          handleChange(row.id, "item_code", e.target.value)
                        }
                        onBlur={() => handleBlur(row.id)}
                      />
                    </div>
                    <div className="col-product-col">
                      <input
                        value={row.name || ""}
                        onChange={(e) =>
                          handleChange(row.id, "name", e.target.value)
                        }
                        onBlur={() => handleBlur(row.id)}
                      />
                    </div>
                    <div className="col-inprice-col">
                      <input
                        type="number"
                        value={row.in_price || ""}
                        onChange={(e) =>
                          handleChange(row.id, "in_price", e.target.value)
                        }
                        onBlur={() => handleBlur(row.id)}
                      />
                    </div>
                    <div className="col-price-col">
                      <input
                        type="number"
                        value={row.price || ""}
                        onChange={(e) =>
                          handleChange(row.id, "price", e.target.value)
                        }
                        onBlur={() => handleBlur(row.id)}
                      />
                    </div>
                    <div className="col-unit-col">
                      <input
                        value={row.unit || ""}
                        onChange={(e) =>
                          handleChange(row.id, "unit", e.target.value)
                        }
                        onBlur={() => handleBlur(row.id)}
                      />
                    </div>
                    <div className="col-instock-col">
                      <input
                        type="number"
                        value={row.in_stock || ""}
                        onChange={(e) =>
                          handleChange(row.id, "in_stock", e.target.value)
                        }
                        onBlur={() => handleBlur(row.id)}
                      />
                    </div>
                    <div className="col-desc-col">
                      <input
                        value={row.description || ""}
                        onChange={(e) =>
                          handleChange(row.id, "description", e.target.value)
                        }
                        onBlur={() => handleBlur(row.id)}
                      />
                    </div>
                    <div className="col-actions-col">
                      <button className="actions-btn">⋯</button>
                    </div>
                    {savingMap[row.id] && (
                      <div className="pricelist-saving">Saving...</div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="sidebar-backdrop show" onClick={closeSidebar} />
      )}
    </div>
  );
}
