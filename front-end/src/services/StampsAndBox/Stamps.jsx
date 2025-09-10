const API = "http://localhost:5532";

export async function getStamps() {
  try {
    const res = await fetch(`${API}/stamps`);
    if (!res.ok) throw new Error("Falha ao buscar /stamps");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}