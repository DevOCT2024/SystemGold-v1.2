import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import type { Prisma, user as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from "bcrypt";
import { SupabaseService } from 'src/supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
type user = import('@prisma/client').user;





@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        private readonly prismaService: PrismaService,
        private readonly supabase: SupabaseService,
        private readonly jwtService: JwtService,
    ) { }

    async createUser(data: Prisma.userCreateInput) {

        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            const user = await this.prismaService.user.create({ data })

            const payload = {
                id: user.id,
                name: user.name,
            }

            return {
                access_token: await this.jwtService.signAsync(payload),
                userData: { id: user.id, name: user.name },
            }

        } catch (error) {
            throw error;

        }
    }


    async FindOneUserByEmail(email: string): Promise<user | null> {
        try {

            const user = await this.prismaService.user.findUnique({ where: { email } })
            return user ? user : null;

        } catch (error) {

            throw error

        }

    }

    async getUserById(id: string): Promise<Omit<user, 'password'> | null> {
        try {
            const user = await this.prismaService.user.findUnique({ where: { id } })

            if (!user) {
                throw new NotFoundException("Usuario não encontrado")
            }

            const { password, ...OmitedUser } = user

            return OmitedUser

        } catch (error) {
            throw error;
        }
    }


    async updateUserInformations(data: any, id: string): Promise<user | null> {
        try {
            if (!id) throw new BadRequestException('id é obrigatório');

            // Adress é JSON no Prisma -> NÃO serialize
            // (se vier string JSON do controller, já veio parseado)
            if (data.Adress === undefined) delete data.Adress;

            // Logo pode ser base64 (dataURL) OU path já salvo
            if (typeof data.Logo === 'string' && data.Logo.length > 0) {
                if (data.Logo.startsWith('data:image/')) {
                    const raw = data.Logo.replace(/^data:image\/\w+;base64,/, '');
                    const buf = Buffer.from(raw, 'base64');
                    const uploadLogo = await this.supabase.uploadImage(`Logo-${id}`, buf);
                    if (!uploadLogo || uploadLogo.error) {
                        const msg = uploadLogo?.error?.message || 'Falha no upload do logo';
                        throw new BadRequestException(msg);
                    }
                    data.Logo = uploadLogo.data.path; // salva path retornado
                } else {
                    // já é path/URL, mantém
                }
            } else {
                // não atualiza logo
                delete data.Logo;
            }

            const user = await this.prismaService.user.update({ data, where: { id } });
            return user;
        } catch (error: any) {
            // logs úteis
            this.logger.error('updateUserInformations error', {
                id,
                keys: Object.keys(data || {}),
                msg: error?.message,
                code: error?.code,
                meta: error?.meta,
            });

            // Erros previsíveis -> 400 com mensagem clara
            if (error?.name === 'BadRequestException') throw error;
            if (error?.code === 'P2002' || error?.code === 'P2025') {
                throw new BadRequestException(error?.message || 'Erro de validação no banco');
            }
            if (typeof error?.message === 'string' && error.message.includes('Unknown arg')) {
                throw new BadRequestException(error.message);
            }

            throw error; // os demais ficam 500, mas agora logados
        }
    }

    async getClubImage(id: string): Promise<string | null> {
        try {
            // busca o path salvo no banco
            const user = await this.prismaService.user.findUnique({
                where: { id },
                select: { Logo: true },
            });
            const logoPath = user?.Logo; // ex.: "logos/Logo-<id>.png"

            if (!logoPath) return null;

            // se já vier URL absoluta (http...), devolve direto
            if (/^https?:\/\//i.test(logoPath)) return logoPath;

            // monta URL pública servida em /static
            return `/static/${logoPath.replace(/^\/?static\//, '')}`;
        } catch (e) {
            throw e;
        }
    }



    // async getClubImage(id: string): Promise<string> {
    //     try {

    //         const { data, error } = await this.supabase.createSignedUrl(`Logo-${id}`, 3600000)

    //         if (error) {
    //             return null;
    //         }
    //         return data.signedUrl

    //     } catch (error) {
    //         throw error;
    //     }

    // }



}
