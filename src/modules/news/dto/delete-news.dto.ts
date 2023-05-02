import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteNewsDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id: string
}