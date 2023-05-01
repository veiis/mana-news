import { Controller, Get, HttpCode, HttpStatus, UseGuards, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/guards/auth.guard";
import { Request } from 'express';
import { GetMyProfileDto } from "./dto/getMyProfile.dto";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Get('me')
    async getMyProfile(@Req() req: Request) {
        const { id }: GetMyProfileDto = req.user

        console.log(id)
        return await this.userService.getMyProfile({ id })
    }

    @Get('profile')
    async getProfile() {
        return []
    }
}

Request