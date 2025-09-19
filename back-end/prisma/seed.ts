import { PrismaClient, TemplateFormat, SlotType } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

// Pasta onde estão as imagens
const IMAGES_DIR = path.join(process.cwd(), 'src', 'images', 'tabloides'); // usa /src/images/tabloides
const IMAGE_URL_PREFIX = 'tabloides'; // o que será guardado no imageKey (usado com /static/...)

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

function slugBaseKey(name: string) {
  // tira acentos, troca não-alfanum por _, uppercase
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase();
}

// Slots genéricos (se quiser, ajuste posições por formato)
function defaultSlots(fmt: TemplateFormat) {
  // posições básicas iguais às que você já usa
  const base = {
    A4_P:  { title: { x: 40,  y: 40,  w: 520, h: 60 }, photo: { x: 40,  y: 120, w: 240, h: 180 }, price: { x: 320, y: 320, w: 180, h: 100 } },
    FEED:  { title: { x: 80,  y: 60,  w: 920, h: 90 }, photo: { x: 80,  y: 220, w: 520, h: 420 }, price: { x: 640, y: 720, w: 260, h: 160 }, badge: { x: 860, y: 60,  w: 140, h: 140 } },
    STORY: { title: { x: 60,  y: 60,  w: 880, h: 80 }, photo: { x: 60,  y: 200, w: 420, h: 360 }, price: { x: 520, y: 620, w: 300, h: 140 } },
  } as const;

  const set = base[fmt];
  const slots: any[] = [
    { key: 'title',  type: SlotType.TEXT,  x: set.title.x,  y: set.title.y,  width: set.title.w,  height: set.title.h,  zIndex: 5 },
    { key: 'photo1', type: SlotType.IMAGE, x: set.photo.x,  y: set.photo.y,  width: set.photo.w,  height: set.photo.h,  zIndex: 1 },
    { key: 'price',  type: SlotType.PRICE, x: set.price.x,  y: set.price.y,  width: set.price.w,  height: set.price.h,  zIndex: 6 },
  ];
  if (fmt === 'FEED' && (base.FEED as any).badge) {
    const b = (base.FEED as any).badge;
    slots.push({ key: 'badge', type: SlotType.BADGE, x: b.x, y: b.y, width: b.w, height: b.h, zIndex: 7 });
  }
  return slots;
}

async function upsertTemplate(baseKey: string, name: string) {
  return prisma.template.upsert({
    where: { baseKey },
    update: {},
    create: { baseKey, name, isActive: true },
  });
}

async function ensureVariantFromFile(tplId: string, fmt: TemplateFormat, filename: string) {
  // evita duplicar o mesmo formato/version
  const found = await prisma.templateVariant.findFirst({
    where: { templateId: tplId, format: fmt, version: 1 },
  });
  if (found) return found;

  const suffix = (fmt === 'A4_P' ? 'a4' : fmt.toLowerCase()) as Suffix;
  const { w, h } = SIZE_MAP[suffix];

  const created = await prisma.templateVariant.create({
    data: {
      templateId: tplId,
      format: fmt,
      widthPx: w,
      heightPx: h,
      imageKey: `${IMAGE_URL_PREFIX}/${filename}`.replace(/\\/g, '/'),
      thumbKey: null,
      schemeKey: 'default',
      version: 1,
      status: 'PUBLISHED',
      slotCount: 0, // será atualizado abaixo
      slots: { create: defaultSlots(fmt) },
    },
    include: { slots: true },
  });

  // atualiza slotCount = slots.length
  await prisma.templateVariant.update({
    where: { id: created.id },
    data: { slotCount: created.slots.length },
  });

  return created;
}

async function main() {
  // 1) ler arquivos da pasta
  const entries = await fs.readdir(IMAGES_DIR);
  const files = entries.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

  // 2) agrupar por baseName + sufixo (story|feed|a4)
  // padrão aceito: <BaseName>-story.jpg | -feed.jpg | -a4.jpg
  const regex = /^(.+)-(story|feed|a4)\.(png|jpe?g|webp)$/i;

  // Map: baseName -> { story?: file, feed?: file, a4?: file }
  const groups = new Map<string, Partial<Record<Suffix, string>>>();

  for (const f of files) {
    const m = f.match(regex);
    if (!m) continue;
    const baseName = m[1];
    const suff = m[2].toLowerCase() as Suffix;
    const g = groups.get(baseName) ?? {};
    g[suff] = f;
    groups.set(baseName, g);
  }

  let createdTemplates = 0;
  let createdVariants = 0;

  for (const [baseName, group] of groups) {
    const baseKey = slugBaseKey(baseName);              // ex.: TABLOIDESABADAODEOFERTAS
    const displayName = baseName.replace(/[-_]+/g, ' '); // nome amigável

    const tpl = await upsertTemplate(baseKey, displayName);
    createdTemplates++;

    for (const suff of ['a4', 'feed', 'story'] as Suffix[]) {
      const file = group[suff];
      if (!file) continue;

      const fmt = FORMAT_MAP[suff];
      await ensureVariantFromFile(tpl.id, fmt, file);
      createdVariants++;
    }
  }

  console.log(`Import concluído ✅ Templates: ${createdTemplates} | Variants: ${createdVariants}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
