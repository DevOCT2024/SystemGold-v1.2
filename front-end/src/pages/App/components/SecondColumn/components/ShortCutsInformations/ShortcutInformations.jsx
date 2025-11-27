import React, { useState } from 'react';
import './ShortcutInformations.css'

const ShortcutInformations = () => {
  const [showShortcuts, setShowShortcuts] = useState(false); // começa fechado

  // posição do painel / botão de atalhos (pode ajustar top/right aqui) 
  const floatingStyle = {
    position: 'fixed',
    right: '12px',
    top: '150px', // ajusta conforme a sua navbar
    
  };

  return (
    <>
      {showShortcuts && (
        <div style={floatingStyle}>
          <div className="box">
            {/* Header igual Selos/Box */}
            <div className="box-header">
              <h3>Atalhos</h3>
              <button
                className="box-hide-btn"
                onClick={() => setShowShortcuts(false)}
                aria-label="Ocultar Atalhos"
                title="Ocultar Atalhos"
              >
                x
              </button>
            </div>

            {/* Conteúdo dos atalhos */}
            <div
              style={{
                width: '100%',
                height: '100%',
                padding: '0 20px 15px 20px',
                boxSizing: 'border-box',
                overflowY: 'auto',
              }}
            >
              <ul
                style={{
                  paddingLeft: '18px',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                <li>Selecionar itens = Shift ou Ctrl</li>
                <li>Deletar item = Del</li>
                <li>Zoom = Scroll Mouse</li>
                <li>Agrupar itens = Ctrl + G</li>
                <li>Desagrupar itens = Ctrl + U</li>
                <li>Voltar = Ctrl + Z</li>
                <li>Avançar = Ctrl + Y</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!showShortcuts && (
        <div className="reopen-wrapper reopen-wrapper--shortcuts">
          <button
            className="reopen-btn"
            onClick={() => setShowShortcuts(true)}
          >
            Atalhos
          </button>
        </div>
      )}
    </>
  );
};

export default ShortcutInformations;
