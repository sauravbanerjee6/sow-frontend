import { authFetch } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUiTexts(screen, lang) {
  try {
    return authFetch(
      `/ui?lang=${encodeURIComponent(lang)}&screen=${encodeURIComponent(
        screen
      )}`
    );
  } catch (error) {}
}

export async function getTerms(lang) {
  try {
    return authFetch(`/terms?lang=${encodeURIComponent(lang)}`);
  } catch (error) {}
}

export async function getPriceList() {
  return authFetch("/priceList");
}

export async function updatePriceItem(id, payload) {
  return authFetch(`/priceList?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
