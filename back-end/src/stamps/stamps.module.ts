import { Module } from '@nestjs/common';
import { StampsService } from './stamps.service';
import { StampsController } from './stamps.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from 'src/supabase/supabase.module';


@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [StampsController],
  providers: [StampsService],
})
export class StampsModule {}