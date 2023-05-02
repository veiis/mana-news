import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model"
import { GetMyProfileDto } from "./dto/getMyProfile.dto";
import { RegisterDto } from "src/modules/auth/dto/register.dto";
import { GetUserByMobileDto } from "./dto/getUserByMobile.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User
    ) { }

    async findUserByMobile(data: GetUserByMobileDto): Promise<User | null> {
        const { mobile } = data
        const user: User = await this.userModel.findOne({ where: { mobile }, raw: true, attributes: { include: ['password'] } })
        return user
    }

    async createUser(data: RegisterDto): Promise<User> {
        const { firstName, lastName, mobile, password } = data
        const newUser: User = await this.userModel.build({ firstName, lastName, mobile, password }).save()
        if (!newUser) { throw new ConflictException("There was an error while creatin user.") }
        return newUser
    }

    async getMyProfile(data: GetMyProfileDto): Promise<User> {
        const { id } = data
        const user: User = await this.userModel.findByPk(id, { raw: true })
        return user
    }
}