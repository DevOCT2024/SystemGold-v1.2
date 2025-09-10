import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StampsService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.stamps.findMany(); }
}
