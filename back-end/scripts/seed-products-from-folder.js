// scripts/seed-products-from-folder.js
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const mysql = require('mysql2/promise');

async function main() {
  const baseDir = process.env.LOCAL_STORAGE_DIR || 'uploads';
  const folder = path.join(baseDir, 'products');

  if (!fs.existsSync(folder)) {
    console.error('Pasta não encontrada:', folder);
    process.exit(1);
  }

  const files = fs.readdirSync(folder).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  console.log(`Encontrados ${files.length} arquivos em ${folder}`);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'seu_banco',
  });

  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    const type = mime.lookup(ext) || 'application/octet-stream';

    // Nome legível: remove extensão, troca -, _ por espaço, decode %20 etc., título maiúsculas
    const namePart = path.basename(f, ext);
    const decoded = safeDecode(namePart);
    const display = toTitle(normalizeName(decoded));

    // image_key deve ser caminho POSIX (com '/')
    const rel = path.posix.join('products', f);

    const [res] = await conn.execute(
      'INSERT INTO `product` (name, price, image_key, mime_type) VALUES (?, ?, ?, ?)',
      [display, 0.00, rel, type]
    );
    console.log(`-> #${res.insertId} ${display} (${rel})`);
  }

  await conn.end();
  console.log('Concluído.');
}

function normalizeName(s) {
  return s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function toTitle(s) {
  return s
    .split(' ')
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase()))
    .join(' ');
}
function safeDecode(s) {
  try { return decodeURIComponent(s); } catch { return s; }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
