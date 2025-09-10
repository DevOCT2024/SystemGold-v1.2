import { ExempleService } from './exemple.service';
import { Controller, Get } from '@nestjs/common';

@Controller('exemple')
export class ExempleController {
  constructor(private readonly exempleService: ExempleService) {}

  @Get()
  findAll() {
    return this.exempleService.findAll();
  }
}
