import React from "react";

const API =  "http://localhost:5532";

/**
 * Thumbnail do layout. Constrói a URL usando /files + imageKey do backend.
 */
const VariantCanvas = ({ imageKey }) => {
  const src = imageKey
    ? `${API}/files/${String(imageKey).replace(/^\/+/, "")}`
    : "";
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "3 / 4",
        background: "#f3f4f6",
        overflow: "hidden",
        borderRadius: 8,
        position: "relative",
      }}
    >
      {!loaded && !failed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          carregando…
        </div>
      )}

      {failed ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            color: "#b91c1c",
            padding: 8,
            textAlign: "center",
          }}
        >
          erro ao carregar imagem
        </div>
      ) : (
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(false);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: loaded ? "block" : "none",
          }}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};

export default VariantCanvas;
