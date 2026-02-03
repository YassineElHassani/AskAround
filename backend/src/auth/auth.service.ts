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
        try {
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
        } catch (error) {
            // Let ConflictException bubble up, wrap others
            if (error.status === 409) {
                throw error;
            }
            throw new UnauthorizedException('Registration failed');
        }
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
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}
