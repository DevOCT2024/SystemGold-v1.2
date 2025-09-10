// src/box/box.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoxService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.box.findMany({
      take: 100, // limite em dev pra não explodir payload
    });
  }
}

