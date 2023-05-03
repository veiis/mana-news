import { IsNotEmpty, IsNumber } from "class-validator";
import { Transform } from 'class-transformer'

export class LikeOneNewsDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id: number
}