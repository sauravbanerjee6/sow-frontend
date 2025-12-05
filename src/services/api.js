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
