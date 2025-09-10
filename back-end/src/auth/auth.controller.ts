import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';


@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("/UserLogin")
  async singIn(
    @Body() {email, password} : {email : string, password :string},
    @Res({ passthrough: true }) response: Response
  ): Promise<{access_token: string, userData: {id: string, name: string}}>{
    const result = await this.authService.singIn({email, password})
    response.cookie("access_token", result.access_token)
    return result
  }
}
