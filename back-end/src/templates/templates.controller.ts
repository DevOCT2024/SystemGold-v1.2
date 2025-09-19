import { Controller, Get, Param, Query } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly svc: TemplatesService) {}

  // GET /templates
  @Get()
  list() {
    return this.svc.list();
  }

  // GET /templates/:baseKey  -> retorna template + variants + slots
  @Get(':baseKey')
  get(@Param('baseKey') baseKey: string) {
    return this.svc.getByBaseKey(baseKey);
  }

  // GET /templates/:baseKey/variant?format=A4_P  -> retorna 1 variant resolvido (mais novo PUBLISHED)
  @Get(':baseKey/variant')
  resolve(
    @Param('baseKey') baseKey: string,
    @Query('format') format?: string,
  ) {
    return this.svc.resolveVariant(baseKey, format);
  }
}
