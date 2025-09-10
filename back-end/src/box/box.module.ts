import { Module } from '@nestjs/common';
import { BoxService } from './box.service';
import { BoxController } from './box.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [BoxController],
  providers: [BoxService],
})
export class BoxModule {}
