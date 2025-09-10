import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExempleService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.exemple.findMany();
  }
}
