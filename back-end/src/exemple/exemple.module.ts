import { Module } from '@nestjs/common';
import { ExempleService } from './exemple.service';
import { ExempleController } from './exemple.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [ExempleController],
  providers: [ExempleService],
})
export class ExempleModule {}
