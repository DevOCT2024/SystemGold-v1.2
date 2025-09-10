// src/product/product.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductService } from './product.service';

@Controller('api/products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  // Health check simples do DB
  @Get('health/db')
  async dbHealth() {
    return this.service['repo'].ping();
  }

  // Lista / busca com paginação
  @Get()
  async search(
    @Query('q') q = '',
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    return this.service.search(q, +page, +pageSize);
  }

  // Criação com upload de imagem (campo "file")
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        /image\/(png|jpe?g|webp)/.test(file.mimetype) ? cb(null, true) : cb(null, false);
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: { name: string; price?: number },
  ) {
    return this.service.create(dto, file);
  }

  // Exclusão por ID (remove registro e arquivo local, se houver)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
