import { Injectable } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'fs';
import { promises as fsp } from 'fs';
import { dirname, join } from 'path';
import { IStorageService } from './storage.interface';

@Injectable()
export class LocalStorageService implements IStorageService {
  private baseDir = process.env.LOCAL_STORAGE_DIR || 'uploads';

  async upload(key: string, buffer: Buffer, _contentType = 'application/octet-stream') {
    const abs = join(this.baseDir, key);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, buffer);
    return { key };
  }

  getPublicUrl(key: string) {
    const base = process.env.APP_URL || 'http://localhost:5532';
    return `${base}/files/${key}`;
  }

  async delete(key: string) { // ⬅️ novo
    const abs = join(this.baseDir, key);
    try {
      await fsp.unlink(abs);
    } catch (err: any) {
      if (err?.code !== 'ENOENT') throw err; 
    }
  }
}