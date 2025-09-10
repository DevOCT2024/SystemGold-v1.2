import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService
    ){}

    async singIn({email, password} : {email : string, password :string}){
        try {

            const user = await this.userService.FindOneUserByEmail(email)

            if(!user){
                throw new NotFoundException("Usuário não encontrado ")
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password)

            if(!isPasswordMatch){
                throw new UnauthorizedException("Credenciais incorretas")
            }

            const payload = {
                id: user.id, 
                name: user.name,
            }

            return {
                access_token: await this.jwtService.signAsync(payload),
                userData: {id: user.id, name: user.name},
            } 

        } catch (error) {

            throw error;

        }
    }
}
