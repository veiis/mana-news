import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength, ArrayMinSize, IsArray } from "class-validator";
import { transformToArray } from "src/tools/transformToArray";

export class UpdateVideoDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    title: string

    @Transform(({ value }) => transformToArray(value))
    @IsArray()
    @ArrayMinSize(1)
    categories: number[]
}