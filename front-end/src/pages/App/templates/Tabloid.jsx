// Tabloid.jsx
import React from "react";
import ChooseLayoutModal from "./EscolherLayoutModal";
import { SelectTabloid } from "../components/FirstColumn/components/SelectTabloid";

export default function Tabloid({ onChooseVariant }) {
  const [selectedTabloid, setSelectedTabloid] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <>
      <div className="selectFormatTabloid">
        {/* use seu <Select /> customizado se preferir; aqui vai com <select> nativo para evitar import */}
        <select
          defaultValue=""
          onChange={(e) => {
            if (!e.target.value) return;
            const parsed = JSON.parse(e.target.value); // {width,height,format,label}
            setSelectedTabloid(parsed);
          }}
          name="selectTabloid"
        >
          <option value="" disabled>Escolha seu Formato</option>
          {SelectTabloid.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        disabled={!selectedTabloid}
        onClick={() => setOpenModal(true)}
      >
        Escolher layout
      </button>

      <ChooseLayoutModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onChooseVariant={(variant) => {
          // mantém seu fluxo: devolve o variant escolhido
          // se quiser, também passe o selectedTabloid para ajustar o Stage
          onChooseVariant?.(variant, selectedTabloid);
          setOpenModal(false);
        }}
        selectedFormat={selectedTabloid?.format || null} // << FILTRO PELO FORMATO
      />
    </>
  );
}