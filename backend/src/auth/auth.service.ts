import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);
        const userId = (user as any)._id.toString();

        const payload = { email: user.email, sub: userId };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: userId,
                name: user.name,
                email: user.email,
            },
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const userId = (user as any)._id.toString();
        const payload = { email: user.email, sub: userId };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: userId,
                name: user.name,
                email: user.email,
            },
        };
    }

    async validateUser(userId: string) {
        return this.usersService.findById(userId);
    }
}
