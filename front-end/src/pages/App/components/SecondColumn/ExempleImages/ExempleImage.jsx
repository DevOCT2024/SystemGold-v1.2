import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.css';
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { faCircleLeft, faCircleRight } from '@fortawesome/free-regular-svg-icons';

const THUMB_WINDOW = 3;



const ExempleImage = ({ blobImg }) => {
  const images = Array.isArray(blobImg) ? blobImg : [];
  const len = images.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0); // início da janela das miniaturas

  const [showExamples, setShowExamples] = useState(false); // ADICIONAR BOTAO DE FECCHAR CAMPO

  const goNext = () => {
    if (len < 2) return;
    setCurrentIndex((prev) => (prev + 1) % len);
  };

  const goPrev = () => {
    if (len < 2) return;
    setCurrentIndex((prev) => (prev - 1 + len) % len);
  };

  const handleThumbClick = (absoluteIndex) => {
    if (absoluteIndex >= 0 && absoluteIndex < len) {
      setCurrentIndex(absoluteIndex);
    }
  };

  // Centraliza (quando possível) a miniatura da imagem principal
  useEffect(() => {
    if (len <= THUMB_WINDOW) {
      setThumbStart(0);
      return;
    }
    let desired = currentIndex - Math.floor(THUMB_WINDOW / 2);
    if (desired < 0) desired = 0;
    if (desired > len - THUMB_WINDOW) desired = len - THUMB_WINDOW;
    setThumbStart(desired);
  }, [currentIndex, len]);

  const visibleThumbs =
    len <= THUMB_WINDOW ? images : images.slice(thumbStart, thumbStart + THUMB_WINDOW);

  return (
    <>
      {showExamples && (
        <div className="carousel-container">
          {/* Header: título + X na mesma linha */}
          <div className="examples-header">
            <h3 style={{ margin: 0 }}>Exemplos</h3>
            <button
              className="box-hide-btn"
              onClick={() => setShowExamples(false)}
              aria-label="Ocultar Exemplos"
              title="Ocultar Exemplos"
            >
              ×
            </button>
          </div>

          {/* -- A PARTIR DAQUI É O SEU CÓDIGO ORIGINAL, INALTERADO -- */}
          <div className="carousel-main">
            <button
              onClick={goPrev}
              className="prev-button"
              aria-label="Imagem anterior"
              disabled={len < 2}
            >
              <FontAwesomeIcon size="2x" icon={faCircleLeft} />
            </button>

            {/* Imagem principal */}
            {len > 0 && (
              <motion.div
                className="carousel-card main-card"
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <img
                  src={images[currentIndex]}
                  alt="Imagem Principal"
                  className="card-image"
                />
              </motion.div>
            )}

            {/* Imagem anterior (apenas se houver mais de 1) */}
            {len > 1 && (
              <motion.div
                className="carousel-card previous-card"
                key={`prev-${(currentIndex - 1 + len) % len}`}
                initial={{ opacity: 0.5, x: -50 }}
                animate={{ opacity: 0.7, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={images[(currentIndex - 1 + len) % len]}
                  alt="Imagem Anterior"
                  className="card-image"
                />
              </motion.div>
            )}

            {/* Imagem seguinte (apenas se houver mais de 1) */}
            {len > 1 && (
              <motion.div
                className="carousel-card next-card"
                key={`next-${(currentIndex + 1) % len}`}
                initial={{ opacity: 0.5, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={images[(currentIndex + 1) % len]}
                  alt="Imagem Seguinte"
                  className="card-image"
                />
              </motion.div>
            )}

            <button
              onClick={goNext}
              className="next-button"
              aria-label="Próxima imagem"
              disabled={len < 2}
            >
              <FontAwesomeIcon size="2x" icon={faCircleRight} />
            </button>
          </div>

          <div className="carousel-thumbnails-container">
            <div className="carousel-thumbnails">
              {visibleThumbs.map((img, idx) => {
                const absoluteIndex = len <= THUMB_WINDOW ? idx : thumbStart + idx;
                const isActive = absoluteIndex === currentIndex;
                return (
                  <motion.div
                    key={absoluteIndex}
                    className={`thumbnail ${isActive ? 'active' : ''}`}
                    onClick={() => handleThumbClick(absoluteIndex)}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${absoluteIndex}`}
                      className="thumbnail-image"
                    />
                  </motion.div>
                );
              })}
              {len === 0 && <p style={{ margin: 0 }}>Carregando imagens...</p>}
            </div>

            <button
              onClick={goNext}
              className="next-button"
              aria-label="Avançar miniaturas"
              disabled={len < 2}
            >
              <FontAwesomeIcon size="2x" icon={faCircleRight} />
            </button>
          </div>
        </div>
      )}

      {/* Botão flutuante para reabrir (mesmo padrão dos Box; você ajusta a posição no CSS) */}
      {!showExamples && (
        <div className="reopen-floatingEX">
          <button
            className="reopen-btn"
            onClick={() => setShowExamples(true)}
            aria-label="Mostrar Exemplos"
            title="Mostrar Exemplos"
          >
            Exemplos
          </button>
        </div>
      )}
    </>
  );

};

export default ExempleImage;
