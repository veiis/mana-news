import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    @IsPhoneNumber()
    mobile: string

    @IsNotEmpty()
    password: string
}