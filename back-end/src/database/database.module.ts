import { Global, Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';

@Global()
@Module({
  providers: [
    {
      provide: 'MYSQL_POOL',
      useFactory: async () => {
        return createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          port: Number(process.env.DB_PORT ?? 3306),
          waitForConnections: true,
          connectionLimit: 10,
          namedPlaceholders: true,
        });
      },
    },
  ],
  exports: ['MYSQL_POOL'],
})
export class DatabaseModule {}
