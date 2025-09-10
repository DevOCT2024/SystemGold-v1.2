import React, { useState } from 'react';

const ShortcutInformations = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const containerStyle = {
    position: 'absolute', // Alinha o componente de forma absoluta
    top: '150px', // Ajuste conforme necessário para alinhar com a navbar
    right: '40px', // Posiciona próximo à borda direita
    zIndex: 2000, // Garante que fique acima de outros elementos
  };

  const boxStyle = {
    backgroundColor: '#d00000', // Cor da navbar vermelha
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    transition: 'background-color 0.3s ease', // Adiciona transição suave
  };

  const tooltipStyle = {
    position: 'absolute',
    top: '110%',
    right: '0', // Alinha o tooltip com o botão
    transform: 'translateX(0)', // Remove o deslocamento horizontal
    width: '250px',
    backgroundColor: '#f8f9fa', // Cor de fundo mais clara
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    zIndex: 10000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    animation: 'fadeIn 0.3s ease-in-out',
  };

  const titleStyle = {
    fontWeight: 'bold',
    color: '#d00000', // Mantém o vermelho para o título
    marginBottom: '10px',
    textAlign: 'center',
  };

  const listStyle = {
    paddingLeft: '15px',
    fontSize: '14px',
    margin: 0,
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={boxStyle}>
        Atalhos
      </div>

      {showTooltip && (
        <div style={tooltipStyle}>
          <p style={titleStyle}>Atalhos Importantes</p>
          <ul style={listStyle}>
            <li>Selecionar itens = Shift ou Ctrl</li>
            <li>Deletar item = Del</li>
            <li>Zoom = Scroll Mouse</li>
            <li>Agrupar itens = Ctrl + G</li>
            <li>Desagrupar itens = Ctrl + U</li>
            <li>Voltar = Ctrl + Z</li>
            <li>Avançar = Ctrl + Y</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShortcutInformations;
