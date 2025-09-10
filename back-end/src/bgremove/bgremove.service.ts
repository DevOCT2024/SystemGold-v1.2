import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';
const sharp = require('sharp');

@Injectable()
export class BgremoveService {
    private readonly rembgUrl: string;
    private readonly logger = new Logger(BgremoveService.name);

    constructor(private readonly config: ConfigService) {
        this.rembgUrl = this.config.get<string>('REMBG_URL') ?? 'http://localhost:7000/api/remove';
    }

    /** Reduz para no máx. 2048px no maior lado e padroniza em PNG para estabilidade. */
    private async normalizeImage(buffer: Buffer): Promise<Buffer> {
        try {
            const meta = await sharp(buffer).metadata();
            const w = meta.width ?? 0;
            const h = meta.height ?? 0;
            const MAX = 2048;

            if ((w && w > MAX) || (h && h > MAX)) {
                const resized = await sharp(buffer)
                    .resize({
                        width: w >= h ? MAX : undefined,
                        height: h > w ? MAX : undefined,
                        fit: 'inside',
                        withoutEnlargement: true,
                    })
                    .png() // padroniza
                    .toBuffer();
                return resized;
            }

            // mesmo sem redimensionar, padroniza para PNG (evita alguns problemas)
            return await sharp(buffer).png().toBuffer();
        } catch (e) {
            // Se algo falhar, retorna original (melhor do que quebrar)
            this.logger.warn(`normalizeImage falhou: ${String(e)}`);
            return buffer;
        }
    }

    /** Envia arquivo (buffer) para o rembg como multipart/form-data (campo "file"). */
    private async sendToRembg(buffer: Buffer): Promise<Buffer> {
        const form = new FormData();
        form.append('file', buffer, {
            filename: 'image.png',
            contentType: 'image/png',
        });

        try {
            const r = await axios.post(this.rembgUrl, form, {
                responseType: 'arraybuffer',
                headers: form.getHeaders(),
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            });
            return Buffer.from(r.data);
        } catch (e: any) {
            const status = e?.response?.status || 500;
            const payload = e?.response?.data;
            const msg = typeof payload === 'string' ? payload : (payload?.toString?.() || e?.message || 'Erro ao chamar rembg');
            this.logger.error(`rembg erro ${status}: ${msg}`);
            throw new HttpException(msg, status);
        }
    }

    /** Upload de arquivo vindo do cliente */
    async removeFromFile(file: Express.Multer.File): Promise<Buffer> {
        if (!file) throw new BadRequestException('Arquivo não enviado.');

        const normalized = await this.normalizeImage(file.buffer);
        return await this.sendToRembg(normalized);
    }

    /** URL pública: baixa no Nest, normaliza, e envia como arquivo ao rembg */
    async removeFromUrl(url: string): Promise<Buffer> {
        if (!url) throw new BadRequestException('URL não enviada.');

        // 1) data URL (ex.: "data:image/png;base64,....")
        if (/^data:/i.test(url)) {
            try {
                const m = url.match(/^data:(.+?);base64,(.*)$/);
                if (!m) throw new Error('Data URL inválida');
                const buf = Buffer.from(m[2], 'base64');
                const normalized = await this.normalizeImage(buf);
                return await this.sendToRembg(normalized);
            } catch (e) {
                this.logger.error(`DataURL erro: ${String(e)}`);
                throw new HttpException('Falha ao processar data URL', 400);
            }
        }

        // 2) blob URL (ex.: "blob:...") não existe no servidor — peça arquivo
        if (/^blob:/i.test(url)) {
            throw new HttpException('blob URL não suportada no servidor — envie como arquivo', 400);
        }

        // 3) http(s): baixar com headers “de browser”, normalizar e enviar
        try {
            const headers = {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                    '(KHTML, like Gecko) Chrome/123 Safari/537.36',
                Accept: 'image/*,*/*;q=0.8',
                Referer: new URL(url).origin,
            };
            const resp = await axios.get(url, { responseType: 'arraybuffer', headers, maxRedirects: 5 });
            const originalBuf = Buffer.from(resp.data);
            const normalized = await this.normalizeImage(originalBuf);
            return await this.sendToRembg(normalized);
        } catch (e: any) {
            const status = e?.response?.status || 502;
            const msg = e?.message || 'Falha ao baixar a imagem remota';
            this.logger.error(`Download URL erro ${status}: ${msg}`);
            throw new HttpException(msg, status);
        }
    }
}
