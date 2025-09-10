// src/bgremove/bgremove.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { BgremoveController } from './bgremove.controller';
import { BgremoveService } from './bgremove.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      limits: { fileSize: 30 * 1024 * 1024 }, // 10MB
    }),
  ],
  controllers: [BgremoveController],
  providers: [BgremoveService],
  exports: [BgremoveService],
})
export class BgremoveModule {}
