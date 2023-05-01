import { Injectable, UnauthorizedException, NotFoundException, HttpException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { hash, genSalt, compare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    constructor(
        private usersSerivce: UsersService,
        private jwtService: JwtService
    ) { }

    async login(data: LoginDto) {
        const { mobile, password } = data

        const user = await this.usersSerivce.findUserByMobile({ mobile })
        if (!user) throw new NotFoundException()

        const doesPasswordMatch = await compare(password, user.password)

        if (!doesPasswordMatch) throw new UnauthorizedException()

        const payload = { id: user.id, role: user.role }

        const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_TOKEN_SECRET })

        return { accessToken }
    }

    async register(data: RegisterDto) {
        const { firstName, lastName, mobile, password } = data

        const user = await this.usersSerivce.findUserByMobile({ mobile })
        if (user) throw new HttpException('Duplicate User Mobile', 409)

        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt);

        const newUser = await this.usersSerivce.createUser({ firstName, lastName, mobile, password: hashedPassword })

        const payload = { id: newUser.id, role: newUser.role };

        const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_TOKEN_SECRET })

        return { accessToken }
    }
}