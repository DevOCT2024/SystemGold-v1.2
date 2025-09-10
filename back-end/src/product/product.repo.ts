import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'mysql2/promise';

@Injectable()
export class ProductRepo {
  constructor(@Inject('MYSQL_POOL') private pool: Pool) {}

  async ping() {
    const [rows] = await this.pool.query('SELECT NOW() as now');
    return rows as any[];
  }

  async create(p: { name: string; price?: number | null; image_key?: string | null; mime_type?: string | null }) {
    const [res] = await this.pool.execute(
      'INSERT INTO `product` (name, price, image_key, mime_type) VALUES (?, ?, ?, ?)',
      [p.name, p.price ?? 0.0, p.image_key ?? null, p.mime_type ?? null],
    );
    const id = (res as any).insertId;
    const [rows] = await this.pool.execute(
      'SELECT id, name, price, image_key, mime_type, created_at, updated_at FROM `product` WHERE id = ?',
      [id],
    );
    return (rows as any[])[0];
  }

  async findAndCount(q: string, limit: number, offset: number) {
    const like = `%${q}%`;
    const where = q ? 'WHERE name LIKE ?' : '';
    const safeLimit  = Math.max(1, Math.min(Number(limit)  || 20, 100));
    const safeOffset = Math.max(0, Number(offset) || 0);

    const listSql = `
      SELECT id, name, price, image_key, mime_type, created_at, updated_at
      FROM \`product\`
      ${where}
      ORDER BY id DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;
    const [rows] = await this.pool.execute(listSql, q ? [like] : []);

    const countSql = `
      SELECT COUNT(*) AS count
      FROM \`product\`
      ${where}
    `;
    const [cnt] = await this.pool.execute(countSql, q ? [like] : []);
    const count = (cnt as any[])[0].count as number;

    return { rows: rows as any[], count };
  }

  // ⬇️ novos
  async findById(id: number) {
    const [rows] = await this.pool.execute(
      'SELECT id, name, price, image_key, mime_type FROM `product` WHERE id = ?',
      [id],
    );
    return (rows as any[])[0] || null;
  }

  async deleteById(id: number) {
    const [res] = await this.pool.execute('DELETE FROM `product` WHERE id = ?', [id]);
    return (res as any).affectedRows as number;
  }
}
