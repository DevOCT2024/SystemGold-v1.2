// src/pages/App/templates/ChooseLayoutModal.jsx
import React from "react";
import { createPortal } from "react-dom";
import VariantCanvas from "./VariantCanvas";
import "./LayoutModal.css";

const API = "http://localhost:5532";

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} - ${url}`);
  return r.json();
}

// Normaliza string
const s = (x) => (typeof x === "string" ? x.trim().toLowerCase() : "");

// Detecta formato do variant de forma resiliente
function detectFormat(v) {
  const f = s(v.format);
  if (f === "a4" || f === "story" || f === "feed") return f; // <- corrigido

  const nt = `${s(v.name)} ${s(v.title)}`;
  if (nt.includes(" a4")) return "a4";
  if (nt.includes(" story")) return "story";
  if (nt.includes(" feed")) return "feed";

  const w = Number(v.widthPx) || 0;
  const h = Number(v.heightPx) || 0;
  if ((w === 600 && h === 800) || (w === 800 && h === 600)) return "a4";
  if (w === 1000 && h === 1000) return "story";
  if ((w === 1080 && h === 1440) || (w === 1440 && h === 1080)) return "feed";

  return "";
}

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onChooseVariant: (variant) => void
 * - selectedFormat?: "a4" | "story" | "feed"
 */
const ChooseLayoutModal = ({ open, onClose, onChooseVariant, selectedFormat }) => {
  const [allVariants, setAllVariants] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    let alive = true;

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    (async () => {
      setLoading(true);
      setError("");
      try {
        const templates = await fetchJson(`${API}/templates`);
        const fulls = await Promise.all(
          templates.map((t) => fetchJson(`${API}/templates/${t.baseKey}`))
        );

        const all = fulls.flatMap((tpl) =>
          (tpl.variants ?? []).map((v) => ({
            id: v.id,
            name: `${tpl.name} — ${v.format}`,
            imageKey: v.thumbKey ?? v.imageKey,
            widthPx: Number(v.widthPx),
            heightPx: Number(v.heightPx),
            baseKey: tpl.baseKey,
            format: s(v.format),
            originalImageKey: v.imageKey,
            title: tpl.name,
          }))
        );

        if (alive) setAllVariants(all);
      } catch (e) {
        if (alive) setError(e?.message || "Falha ao carregar layouts");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  // filtros
  const fmt = s(selectedFormat);
  const text = s(query);

  const byFormat = allVariants.filter((v) => {
    if (!fmt) return true;
    return detectFormat(v) === fmt;
  });

  const filtered = text
    ? byFormat.filter((v) => s(v.name).includes(text) || s(v.title).includes(text))
    : byFormat;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      className="choose-layout-overlay"
      onClick={onClose}
    >
      <div className="choose-layout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="clm-header">
          <h2>Escolher Layout{fmt ? ` • ${fmt.toUpperCase()}` : ""}</h2>
          <button onClick={onClose} aria-label="Fechar" title="Fechar">✕</button>
        </div>

        {/* Barra de busca */}
        <div className="clm-toolbar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome"
          />
        </div>

        {/* Conteúdo */}
        <div className="clm-content">
          {loading && <div className="clm-loading">carregando layouts…</div>}
          {error && <div className="clm-error">{error}</div>}

          {!loading && !error && filtered.length > 0 && (
            <div className="clm-grid">
              {filtered.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => onChooseVariant?.(variant)}
                  title={variant.name}
                  aria-label={`Selecionar layout ${variant.name}`}
                  className="clm-item"
                >
                  <div className="clm-preview">
                    {/* Container absoluto p/ o canvas ocupar toda a área interna com padding */}
                    <div className="clm-canvas">
                      <VariantCanvas imageKey={variant.imageKey} />
                    </div>
                  </div>

                  <div className="clm-caption" title={variant.name}>
                    {variant.name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="clm-empty">
              Nenhum layout encontrado
              {query ? ` para “${query}”` : fmt ? ` para ${fmt.toUpperCase()}` : ""}.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ChooseLayoutModal;
