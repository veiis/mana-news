import { IsNotEmpty, IsNumber } from "class-validator";
import { Transform } from 'class-transformer'

export class GetOneCategoryDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id: number
}