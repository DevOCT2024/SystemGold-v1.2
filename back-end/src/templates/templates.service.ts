import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, TemplateFormat } from '@prisma/client';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    // lista básica de templates (com contagem de variants)
    const items = await this.prisma.template.findMany({
      select: {
        id: true,
        baseKey: true,
        name: true,
        isActive: true,
        _count: { select: { variants: true } },
      },
      orderBy: { name: 'asc' },
    });
    return items;
  }

  async getByBaseKey(baseKey: string) {
    const tpl = await this.prisma.template.findUnique({
      where: { baseKey },
      include: { variants: { include: { slots: true } } },
    });
    if (!tpl) throw new NotFoundException(`Template ${baseKey} não encontrado`);
    return tpl;
  }

  async resolveVariant(baseKey: string, format?: string) {
    const parsed = this.parseFormat(format);
    const variant = await this.prisma.templateVariant.findFirst({
      where: {
        template: { baseKey },
        ...(parsed ? { format: parsed } : {}),
        status: 'PUBLISHED',
      },
      include: { slots: true, template: { select: { id: true, baseKey: true, name: true } } },
      orderBy: { version: 'desc' },
    });

    if (!variant) {
      // cai pro template completo pra ajudar no debug
      const hasTemplate = await this.prisma.template.findUnique({ where: { baseKey } });
      if (!hasTemplate) throw new NotFoundException(`Template ${baseKey} não encontrado`);
      throw new NotFoundException(
        `Nenhum variant PUBLISHED encontrado para ${baseKey}` + (parsed ? ` com formato ${parsed}` : ''),
      );
    }

    return variant;
  }

  private parseFormat(fmt?: string): TemplateFormat | undefined {
    if (!fmt) return undefined;
    const key = String(fmt).toUpperCase();
    const values = Object.values(TemplateFormat) as string[];
    if (values.includes(key)) return key as TemplateFormat;
    throw new BadRequestException(`Formato inválido: ${fmt}. Use um de: ${values.join(', ')}`);
  }
}
