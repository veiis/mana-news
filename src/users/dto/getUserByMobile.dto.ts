import { IsPhoneNumber } from "class-validator";

export class GetUserByMobileDto {
    @IsPhoneNumber()
    mobile: string
}