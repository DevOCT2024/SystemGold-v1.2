import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductModule } from './product/product.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PaymentModule } from './payment/payment.module';
import { StampsModule } from './stamps/stamps.module';
import { BoxModule } from './box/box.module';
import { ExempleModule } from './exemple/exemple.module';
import { join } from 'path';
import { StorageModule } from './storage/storage.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { BgremoveModule } from './bgremove/bgremove.module'
import { TemplatesModule } from './templates/templates.module';




@Module({
  imports: [UserModule, PrismaModule, AuthModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 60000 // tempo em milisegundos para expirar a cache - ESTAVA 600000 - 10MIN
    }),
    ProductModule,
    StampsModule,
    BoxModule,
    ExempleModule,
    SupabaseModule,   
    PaymentModule,
    DatabaseModule,
    StorageModule,
    ProductModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BgremoveModule,
    TemplatesModule,
    ServeStaticModule.forRoot(
      { rootPath: join(process.cwd(), 'src', 'images', 'products'), serveRoot: '/files/products' },
      { rootPath: join(process.cwd(), 'src', 'images', 'stamps'), serveRoot: '/files/stamps' },
      { rootPath: join(process.cwd(), 'src', 'Images', 'box'), serveRoot: '/files/box' },
      { rootPath: join(process.cwd(), 'src', 'Images', 'exemples'), serveRoot: '/files/exemples' },
      { rootPath: join(process.cwd(), 'src', 'images', 'tabloides'), serveRoot: '/files/tabloides/' },
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
