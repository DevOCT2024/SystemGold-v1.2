// src/services/Products/Products.jsx
import { api } from "../api";

/** Busca produtos (retorna apenas o array para compat com o front atual). */
export const FindProduct = async (value, page = 1, pageSize = 20) => {
  try {
    const res = await api.get("/products", {
      params: { q: value || "", page, pageSize },
      withCredentials: true,
    });
    const arr = res.data?.data ?? [];
    return arr.length ? arr : [{ message: "Nenhum produto encontrado" }];
  } catch (error) {
    console.error(error);
    return [{ message: "Nenhum produto encontrado" }];
  }
};

/**
 * Cria produto.
 * Aceita:
 *  - FormData (name, price?, file [File ou dataURL]),
 *  - Objeto { name, price?, file?: File | dataURL }.
 * Se file for dataURL (ex.: remove.bg), converte para Blob e define filename conforme o MIME.
 */
export const registerNewProduct = async (values) => {
  try {
    let fd = new FormData();

    if (values instanceof FormData) {
      const nameFromFD = values.get("name") || "upload";

      for (const [k, v] of values.entries()) {
        if (k !== "file") {
          fd.append(k, v);
          continue;
        }

        // Campo 'file'
        if (typeof v === "string" && v.startsWith("data:")) {
          const mime = mimeFromDataURL(v);
          const blob = dataURLtoBlob(v);
          fd.append("file", blob, guessFileName(nameFromFD, mime));
        } else if (v instanceof File) {
          fd.append("file", v, v.name || guessFileName(nameFromFD, v.type || "image/jpeg"));
        } else {
          // fallback
          fd.append("file", v);
        }
      }
    } else {
      const { name, price, file } = values || {};
      if (!name) throw new Error("name é obrigatório");

      fd.append("name", name);
      if (price != null) fd.append("price", String(price));

      if (file instanceof File) {
        fd.append("file", file, file.name || guessFileName(name, file.type || "image/jpeg"));
      } else if (typeof file === "string" && file.startsWith("data:")) {
        const mime = mimeFromDataURL(file);
        const blob = dataURLtoBlob(file);
        fd.append("file", blob, guessFileName(name, mime));
      }
    }

    const res = await api.post("/products", fd, {
      // deixe o axios definir o boundary automaticamente
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/* ---------------- helpers ---------------- */

function mimeFromDataURL(dataUrl) {
  return dataUrl.match(/^data:(.*?);base64,/)?.[1] || "application/octet-stream";
}

function dataURLtoBlob(dataUrl) {
  const mime = mimeFromDataURL(dataUrl);
  const base64 = dataUrl.split(",")[1] || "";
  const bin = atob(base64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type: mime });
}

function guessFileName(name = "upload", mime = "image/jpeg") {
  const base =
    String(name)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "upload";

  let ext = ".jpg";
  if (mime.includes("png")) ext = ".png";
  else if (mime.includes("webp")) ext = ".webp";
  else if (mime.includes("jpeg")) ext = ".jpg";
  else if (mime.includes("gif")) ext = ".gif";

  return `${base}${ext}`;
}
