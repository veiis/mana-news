import { IsNumber } from "class-validator";

export class GetMyProfileDto {
    @IsNumber()
    id: number
}