import { PrismaClient, TemplateFormat, SlotType } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

// --------- CONFIG ---------
const IMAGES_DIR = path.join(process.cwd(), 'src', 'images', 'tabloides');
const IMAGE_URL_PREFIX = 'tabloides'; // vira: tabloides/<arquivo ou subpasta/arquivo>
type Suffix = 'story' | 'feed' | 'a4';

const FORMAT_MAP: Record<Suffix, TemplateFormat> = {
  story: 'STORY',
  feed: 'FEED',
  a4: 'A4_P',
};

const SIZE_MAP: Record<Suffix, { w: number; h: number }> = {
  story: { w: 1000, h: 1000 },
  feed:  { w: 1080, h: 1440 },
  a4:    { w: 600,  h: 800  },
};
// --------- /CONFIG ---------

// util: slug para baseKey (UPPERCASE, sem acento, com _)
function slugBaseKey(name: string) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase();
}

// Recursivo opcional: lista todos os arquivos dentro da pasta
async function listFilesRecursive(dir: string): Promise<string[]> {
  const out: string[] = [];
  const ents = await fs.readdir(dir, { withFileTypes: true });
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await listFilesRecursive(p)));
    } else {
      out.push(p);
    }
  }
  return out;
}

// Slots default (ajuste se quiser por formato)
function defaultSlots(fmt: TemplateFormat) {
  const base = {
    A4_P:  { title: { x: 40,  y: 40,  w: 520, h: 60 }, photo: { x: 40,  y: 120, w: 240, h: 180 }, price: { x: 320, y: 320, w: 180, h: 100 } },
    FEED:  { title: { x: 80,  y: 60,  w: 920, h: 90 }, photo: { x: 80,  y: 220, w: 520, h: 420 }, price: { x: 640, y: 720, w: 260, h: 160 }, badge: { x: 860, y: 60,  w: 140, h: 140 } },
    STORY: { title: { x: 60,  y: 60,  w: 880, h: 80 }, photo: { x: 60,  y: 200, w: 420, h: 360 }, price: { x: 520, y: 620, w: 300, h: 140 } },
  } as const;

  const set = (base as any)[fmt];
  const slots: any[] = [
    { key: 'title',  type: SlotType.TEXT,  x: set.title.x,  y: set.title.y,  width: set.title.w,  height: set.title.h,  zIndex: 5 },
    { key: 'photo1', type: SlotType.IMAGE, x: set.photo.x,  y: set.photo.y,  width: set.photo.w,  height: set.photo.h,  zIndex: 1 },
    { key: 'price',  type: SlotType.PRICE, x: set.price.x,  y: set.price.y,  width: set.price.w,  height: set.price.h,  zIndex: 6 },
  ];
  if (fmt === 'FEED' && base.FEED.badge) {
    const b = base.FEED.badge;
    slots.push({ key: 'badge', type: SlotType.BADGE, x: b.x, y: b.y, width: b.w, height: b.h, zIndex: 7 });
  }
  return slots;
}

async function upsertTemplate(baseKey: string, name: string) {
  return prisma.template.upsert({
    where: { baseKey },
    update: { name, isActive: true },
    create: { baseKey, name, isActive: true },
  });
}

/**
 * Cria variant se:
 *  - NÃO existir um variant com o mesmo (templateId, format, imageKey)
 * Se existir um variant no mesmo (templateId, format) mas com outra imagem,
 * cria uma NOVA versão: version = max(version) + 1.
 */
async function ensureVariant(templateId: string, fmt: TemplateFormat, imageKey: string, suffix: Suffix) {
  // Se já existe um variant exatamente com essa imagem, pula.
  const existingSameImage = await prisma.templateVariant.findFirst({
    where: { templateId, format: fmt, imageKey },
    select: { id: true },
  });
  if (existingSameImage) {
    return { created: false, reason: 'image-exists' as const };
  }

  // Pega a próxima versão para esse formato
  const max = await prisma.templateVariant.aggregate({
    where: { templateId, format: fmt },
    _max: { version: true },
  });
  const nextVersion = (max._max.version ?? 0) + 1;

  const { w, h } = SIZE_MAP[suffix];

  const created = await prisma.templateVariant.create({
    data: {
      templateId,
      format: fmt,
      widthPx: w,
      heightPx: h,
      imageKey,
      thumbKey: null,
      schemeKey: 'default',
      version: nextVersion,
      status: 'PUBLISHED',
      slotCount: 0,
      slots: { create: defaultSlots(fmt) },
    },
    include: { slots: true },
  });

  await prisma.templateVariant.update({
    where: { id: created.id },
    data: { slotCount: created.slots.length },
  });

  return { created: true, id: created.id };
}

async function main() {
  // 1) varre arquivos
  const allPaths = await listFilesRecursive(IMAGES_DIR);
  const files = allPaths.filter(p => /\.(png|jpe?g|webp)$/i.test(p));

  // 2) agrupa por <BaseName>-<suffix>.<ext>
  const regex = /[/\\]([^/\\]+)-(story|feed|a4)\.(png|jpe?g|webp)$/i;
  // Map: baseName -> { story?: relPath, feed?: relPath, a4?: relPath }
  const groups = new Map<string, Partial<Record<Suffix, string>>>();

  const skipped: string[] = [];
  for (const abs of files) {
    const m = abs.match(regex);
    if (!m) { skipped.push(abs); continue; }
    const baseName = m[1];
    const suff = m[2].toLowerCase() as Suffix;

    // caminho relativo a IMAGES_DIR para montar imageKey
    const rel = path.relative(IMAGES_DIR, abs).split(path.sep).join('/'); // normaliza p/ URL
    const g = groups.get(baseName) ?? {};
    g[suff] = rel;
    groups.set(baseName, g);
  }

  let newTemplates = 0;
  let updatedTemplates = 0;
  let newVariants = 0;
  let skippedVariants = 0;

  for (const [baseName, group] of groups) {
    const baseKey = slugBaseKey(baseName);
    const displayName = baseName.replace(/[-_]+/g, ' ');

    // upsert template
    const existingTpl = await prisma.template.findUnique({ where: { baseKey }, select: { id: true, name: true } });
    const tpl = await upsertTemplate(baseKey, displayName);
    if (existingTpl) updatedTemplates++; else newTemplates++;

    // para cada sufixo conhecido
    for (const suff of ['a4', 'feed', 'story'] as Suffix[]) {
      const relFile = (group as any)[suff] as string | undefined;
      if (!relFile) continue;

      const fmt = FORMAT_MAP[suff];
      const imageKey = `${IMAGE_URL_PREFIX}/${relFile}`.replace(/\\/g, '/');

      const res = await ensureVariant(tpl.id, fmt, imageKey, suff);
      if (res.created) newVariants++;
      else skippedVariants++;
    }
  }

  console.log('--- SEED TABLÓIDES ---');
  console.log(`Templates: +${newTemplates} novos, ${updatedTemplates} já existiam`);
  console.log(`Variants:  +${newVariants} novos, ${skippedVariants} pulados (mesma imagem)`);
  if (skipped.length) {
    console.log(`Arquivos ignorados por padrão de nome não reconhecido (${skipped.length}):`);
    for (const s of skipped) console.log('  -', s);
  }
  console.log('Import concluído ✅');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
