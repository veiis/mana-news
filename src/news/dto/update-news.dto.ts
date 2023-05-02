import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength, MaxLength, ArrayMinSize, IsArray, IsNumber } from "class-validator";
import { transformToArray } from "src/tools/transformToArray";

export class UpdateNewsDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id: number

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