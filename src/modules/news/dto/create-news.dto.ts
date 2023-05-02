import { IsNotEmpty, IsString, MinLength, MaxLength, ArrayMinSize, IsArray } from "class-validator";
import { Transform } from 'class-transformer'
import { transformToArray } from "src/tools/transformToArray";

export class CreateNewsDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    title: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(1500)
    description: string

    @Transform(({ value }) => transformToArray(value))
    @IsArray()
    @ArrayMinSize(1)
    categories: number[]
}