import { Module } from '@nestjs/common';
import { LocalStorageService } from './local-storage.service';

@Module({
  providers: [{ provide: 'STORAGE', useClass: LocalStorageService }],
  exports: ['STORAGE'], // << PRECISA EXPORTAR
})
export class StorageModule {}
