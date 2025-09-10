const API = "http://localhost:5532";

export async function fetchExempleImage() {
  try {
    const res = await fetch(`${API}/exemple`);
    if (!res.ok) throw new Error("Falha ao buscar /exemple");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}
