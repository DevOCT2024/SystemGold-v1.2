import { Controller, Get } from '@nestjs/common';
import { StampsService } from './stamps.service';

@Controller('stamps')
export class StampsController {
  constructor(private readonly stampsService: StampsService) {}

  @Get()
  findAll() {
    return this.stampsService.findAll();
  }
}
