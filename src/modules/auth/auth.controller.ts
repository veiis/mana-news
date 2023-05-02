import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() data: LoginDto) {
        return this.authService.login(data)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() data: RegisterDto) {
        return await this.authService.register(data)
    }
}