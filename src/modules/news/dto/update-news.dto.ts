import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength, MaxLength, ArrayMinSize, IsArray, IsNumber, IsOptional, IsBoolean, } from "class-validator";
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

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
    isSlideshow: boolean

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
    isTrend: boolean

    @Transform(({ value }) => transformToArray(value))
    @IsArray()
    @ArrayMinSize(1)
    categories: number[]

    @Transform(({ value }) => transformToArray(value))
    @IsArray()
    @ArrayMinSize(1)
    tags: number[]
}