import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class LoginDto {
    @IsPhoneNumber()
    mobile: string

    @IsNotEmpty()
    password: string
}