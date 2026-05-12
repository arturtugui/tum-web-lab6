// this replaces localStorage with API calls
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchItems(token, limit = 10, offset = 0) {
  const res = await fetch(`${BASE_URL}/items?limit=${limit}&offset=${offset}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createItem(token, item) {
  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
  return res.json();
}