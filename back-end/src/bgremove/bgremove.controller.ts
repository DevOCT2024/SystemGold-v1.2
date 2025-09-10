// src/bgremove/bgremove.controller.ts
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Body,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BgremoveService } from './bgremove.service';

@Controller('bg')
export class BgremoveController {
  constructor(private readonly svc: BgremoveService) {}

  @Post('remove')
  @UseInterceptors(FileInterceptor('file'))
  async remove(
    @UploadedFile() file: Express.Multer.File,
    @Body('url') url: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    let buf: Buffer | null = null;

    if (file) {
      buf = await this.svc.removeFromFile(file);
    } else if (url) {
      buf = await this.svc.removeFromUrl(url);
    } else {
      throw new BadRequestException(`Envie 'file' (multipart/form-data) OU 'url' (JSON).`);
    }

    res.setHeader('Content-Type', 'image/png');
    return new StreamableFile(buf);
  }
}
