const API_BASE_URL = "http://localhost:3002";

export async function getUiTexts(screen, lang) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/ui?lang=${encodeURIComponent(
        lang
      )}&screen=${encodeURIComponent(screen)}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch UI Texts");
    }

    return res.json();
  } catch (error) {}
}

export async function getTerms(lang) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/terms?lang=${encodeURIComponent(lang)}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch Terms!");
    }

    return res.json();
  } catch (error) {}
}

export async function getPriceList() {
  const res = await fetch(`${API_BASE_URL}/pricelist`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load pricelist!");
  }

  return res.json();
}

export async function updatePriceItem(id, payload) {
  const res = await fetch(
    `${API_BASE_URL}/pricelist/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to update item.");
  }

  return res.json();
}
