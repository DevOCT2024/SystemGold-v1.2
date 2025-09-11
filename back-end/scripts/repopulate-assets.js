// scripts/repopulate-legacy.js
// Repopula box, stamps e exemple a partir de /storage
// Uso:
//   node scripts/repopulate-legacy.js           (tudo)
//   node scripts/repopulate-legacy.js --only=stamps,box
//   node scripts/repopulate-legacy.js --dry-run

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- Config ---
const STORAGE_ROOT = path.resolve(__dirname, '../storage');
const VALID_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Pastas -> handlers
const HANDLERS = {
  stamps: handleStampsOrBox('stamps'),
  box: handleStampsOrBox('box'),
  // Atenção: a PASTA é "exemples", o MODEL é "exemple"
  exemples: handleExemples('exemple'),
};

// ---------- Utils FS ----------
function walk(dir) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}
const toPosixKey = (abs) => path.relative(STORAGE_ROOT, abs).split(path.sep).join('/');
function filenameToTitle(file) {
  const base = path.basename(file, path.extname(file));
  return base
    .replace(/\./g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
function guessMime(ext) {
  const e = ext.toLowerCase();
  if (e === '.jpg' || e === '.jpeg') return 'image/jpeg';
  if (e === '.png') return 'image/png';
  if (e === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

// ---------- Handlers ----------
function handleStampsOrBox(modelName) {
  return async function run(folder) {
    const baseDir = path.join(STORAGE_ROOT, folder);
    const files = walk(baseDir).filter(f => VALID_EXTS.has(path.extname(f).toLowerCase()));
    const stats = { created: 0, updated: 0, skipped: 0, errors: 0, total: files.length };

    console.log(`\n== ${folder.toUpperCase()} ==`);
    console.log(`Arquivos encontrados: ${files.length}`);

    for (const f of files) {
      const key = toPosixKey(f); // ex.: "stamps/ofertacododia05.png"
      try {
        // Upsert por img (sem UNIQUE): findFirst -> create/update
        const existing = await prisma[modelName].findFirst({ where: { img: key }, select: { id: true } });
        if (!existing) {
          await prisma[modelName].create({
            data: {
              img: key,
              // createdAt/updatedAt já tem default(now())
            },
          });
          stats.created++;
        } else {
          await prisma[modelName].update({
            where: { id: existing.id },
            data: {
              img: key, // mantém
              updatedAt: new Date(),
            },
          });
          stats.updated++;
        }
      } catch (e) {
        stats.errors++;
        console.error('Erro em', key, '-', e.message || e);
      }
    }

    console.log(`Resumo ${folder}:`, stats);
    return stats;
  };
}

function handleExemples(modelName /* 'exemple' */) {
  return async function run(folder /* 'exemples' */) {
    const baseDir = path.join(STORAGE_ROOT, folder);
    const files = walk(baseDir).filter(f => VALID_EXTS.has(path.extname(f).toLowerCase()));
    const stats = { created: 0, updated: 0, skipped: 0, errors: 0, total: files.length };

    console.log(`\n== ${folder.toUpperCase()} ==`);
    console.log(`Arquivos encontrados: ${files.length}`);

    for (const f of files) {
      const key = toPosixKey(f); // "exemples/Tabloide...png"
      const name = filenameToTitle(f); // vira "Tabloide ..."
      const mime = guessMime(path.extname(f));
      const qtdDefault = 1; // ajuste se preferir 0

      try {
        const existing = await prisma[modelName].findFirst({ where: { img: key }, select: { id: true } });
        if (!existing) {
          await prisma[modelName].create({
            data: {
              img: key,
              name,
              qtd: qtdDefault,
              diagramacao: null,
            },
          });
          stats.created++;
        } else {
          await prisma[modelName].update({
            where: { id: existing.id },
            data: {
              name,
              // se quiser atualizar qtd/diagramacao, ajuste aqui
            },
          });
          stats.updated++;
        }
      } catch (e) {
        stats.errors++;
        console.error('Erro em', key, '-', e.message || e);
      }
    }

    console.log(`Resumo ${folder}:`, stats);
    return stats;
  };
}

// ---------- Main ----------
(async () => {
  const args = process.argv.slice(2);
  const onlyArg = args.find(a => a.startsWith('--only='));
  const dryRun = args.includes('--dry-run'); // (mantive a flag, mas este script não usa alterações condicionais)

  const selected = onlyArg
    ? onlyArg.replace('--only=', '').split(',').map(s => s.trim()).filter(Boolean)
    : Object.keys(HANDLERS);

  console.log('STORAGE_ROOT:', STORAGE_ROOT);
  console.log('Categorias:', selected.join(', '));
  if (dryRun) console.log('>>> DRY-RUN ligado (mas este script escreve mesmo assim; remova se quiser só simular).');

  const grand = { created: 0, updated: 0, skipped: 0, errors: 0, total: 0 };

  try {
    for (const folder of selected) {
      const handler = HANDLERS[folder];
      if (!handler) {
        console.log(`Pasta "${folder}" não mapeada. Opções: ${Object.keys(HANDLERS).join(', ')}`);
        continue;
      }
      const s = await handler(folder);
      grand.created += s.created; grand.updated += s.updated;
      grand.skipped += s.skipped; grand.errors += s.errors; grand.total += s.total;
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n=== FIM ===');
  console.log('Total:', grand);
})();
