import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5532/api",
})

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5532';

export async function listTemplates() {
  const url = new URL(`/templates`, API_BASE);
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${url.pathname} -> ${res.status}`);
  return res.json();
}

export async function getVariant(baseKey, format) {
  const url = new URL(`/templates/${baseKey}/variant`, API_BASE);
  if (format) url.searchParams.set('format', format);
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`GET ${url.pathname} -> ${res.status} ${txt}`);
  }
  return res.json();
}

// 👇 novo: detalhe do template (traz TODAS as variants com slots)
export async function getTemplate(baseKey) {
  const url = new URL(`/templates/${baseKey}`, API_BASE);
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${url.pathname} -> ${res.status}`);
  return res.json();
}

export const api2 = { listTemplates, getVariant, getTemplate };