// Ajuste conforme onde você guarda as imagens.
// Se copiar o arquivo pra /public/templates/... usar assim:
export function resolveAssetUrl(key) {
  // ex.: "templates/tabloid_padrao/v1/background.png"
  return `/${key}`;
}
