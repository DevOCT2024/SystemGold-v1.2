import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import type { Prisma, user as UserModel } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor } from '@nestjs/cache-manager';
type user = import('@prisma/client').user;

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("/CreateUser")
  async createUser(
    @Body() user: Prisma.userCreateInput,
  ) {
    return this.userService.createUser(user)
  }

  @Get("/GetUser/:id")
  @UseInterceptors(CacheInterceptor)
  async getUserById(
    @Param("id") id: string,
  ): Promise<Omit<user, "password"> | null> {
    const result = await this.userService.getUserById(id)
    return result
  }


  // @Patch("/updateUserInformations")
  // async updateUserInformations(
  //   @Body("") {Adress, Logo, id} : { Adress: string[], Logo: string | null, id: string }

  // ){
  //   console.log(Adress)
  //   return this.userService.updateUserInformations({Adress, Logo},id)
  // }

  @Patch('updateUserInformations')
  async update(@Body() body: any) {
    const { id, Logo, Adress } = body;
    if (!id) throw new BadRequestException('id é obrigatório');

    // Se por acaso vier string JSON, tente parsear; se já vier array/obj, mantém
    let parsedAdress = Adress;
    if (typeof Adress === 'string') {
      try { parsedAdress = JSON.parse(Adress); } catch { /* mantém como está */ }
    }

    return this.userService.updateUserInformations({ Logo, Adress: parsedAdress }, id);
  }

  @Get("/ClubImage/:id")
  @UseInterceptors(CacheInterceptor)
  async getClubImage(
    @Param("id") id: string,
  ): Promise<string> {

    return this.userService.getClubImage(id)

  }


}
