import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepo } from './product.repo';
import { StorageModule } from '../storage/storage.module'; // << ADICIONE ISSO

@Module({
  imports: [StorageModule], // << E ISSO
  controllers: [ProductController],
  providers: [ProductService, ProductRepo],
})
export class ProductModule {}
