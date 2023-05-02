import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            signOptions: { expiresIn: '1h' }
        }),
        UsersModule
    ],
    providers: [AuthService],
    controllers: [AuthController]
})

export class AuthModule { }