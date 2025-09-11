// src/product/product.service.ts
import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { IStorageService } from '../storage/storage.interface';
import { ProductRepo } from './product.repo';

type CreateDto = { name: string; price?: number };

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function extFromMime(m: string | null | undefined) {
  if (!m) return '.png';
  const mm = m.toLowerCase();
  if (mm.includes('png')) return '.png';
  if (mm.includes('webp')) return '.webp';
  if (mm.includes('jpeg') || mm.includes('jpg')) return '.jpg';
  if (mm.includes('gif')) return '.gif';
  return '.png';
}

@Injectable()
export class ProductService {
  constructor(
    @Inject('STORAGE') private readonly storage: IStorageService,
    private readonly repo: ProductRepo,
  ) {}

  async create(dto: CreateDto, file?: Express.Multer.File) {
    try {
      if (!dto?.name || !dto.name.trim()) {
        throw new BadRequestException('name é obrigatório');
      }

      let image_key: string | null = null;
      let mime: string | null = null;

      if (file?.buffer?.length) {
        // derive SEMPRE a extensão a partir do mimetype (preserva PNG e transparência)
        mime = file.mimetype || 'image/png';
        const rand = crypto.randomBytes(6).toString('hex');
        const base = `${slug(dto.name)}-${rand}`;
        const ext = extFromMime(mime);

        image_key = `../images/products/${base}${ext}`;

        try {
          await this.storage.upload(image_key, file.buffer, mime);
        } catch (err: any) {
          console.error('[ProductService.create] storage.upload error:', err?.message || err);
          throw new BadRequestException('Falha ao salvar imagem no storage');
        }
      }

      const created = await this.repo.create({
        name: dto.name.trim(),
        price: dto.price ?? 0.0,
        image_key,
        mime_type: mime, // null quando não enviou arquivo; 'image/png' (ou outro) quando enviou
      });

      const img = created?.image_key ? this.storage.getPublicUrl(created.image_key) : null;

      // normaliza saída (snake_case → camelCase)
      return {
        id: created.id,
        name: created.name,
        image_key: created.image_key,
        mime_type: created.mime_type,
        img,
        price: Number(created.price),
        createdAt: created.created_at,
        updatedAt: created.updated_at,
      };
    } catch (e: any) {
      console.error('[POST /api/products] erro:', e?.sqlMessage || e?.message, e);
      if (e?.getStatus) throw e;
      throw new BadRequestException(e?.sqlMessage || e?.message || 'Erro ao criar produto');
    }
  }

  async search(q = '', page = 1, pageSize = 20) {
    try {
      const { rows, count } = await this.repo.findAndCount(q, pageSize, (page - 1) * pageSize);
      const data = rows.map((p: any) => ({
        id: p.id,
        name: p.name,
        image_key: p.image_key,
        mime_type: p.mime_type,
        img: p.image_key ? this.storage.getPublicUrl(p.image_key) : null,
        price: Number(p.price),
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
      return { data, pagination: { count, page, pageSize } };
    } catch (e: any) {
      console.error('[ProductService.search] DB error:', e?.sqlMessage || e?.message, e);
      throw e;
    }
  }

  async remove(id: number) {
    const prod = await this.repo.findById(id);
    if (!prod) throw new NotFoundException('Produto não encontrado');

    if (prod.image_key) {
      try {
        await this.storage.delete(prod.image_key);
      } catch (e) {
        // loga mas não bloqueia a remoção do registro
        console.error('[ProductService.remove] erro ao deletar arquivo:', (e as any)?.message || e);
      }
    }

    const affected = await this.repo.deleteById(id);
    if (!affected) throw new BadRequestException('Falha ao excluir produto');

    return { message: 'Produto excluído', id };
  }
}
