import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

// Se você tiver PrismaModule/PrismaService, importe aqui.
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [TemplatesController],
  providers: [
    TemplatesService,
    PrismaClient, // ou PrismaService se já existir
  ],
})
export class TemplatesModule {}
