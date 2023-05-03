import { IsNumber, IsEnum, IsOptional, IsString, IsDate, IsArray, ArrayMinSize } from "class-validator";
import { Transform } from "class-transformer";
import { transformToArray } from "src/tools/transformToArray";

export class GetAllNewsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page: number = 1

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    limit: number = 10

    @IsOptional()
    @IsString()
    sort: string = 'createdAt'

    @IsOptional()
    @IsEnum({ 'ASC': 'asc', 'DESC': 'desc' })
    order: string = 'desc'

    @IsOptional()
    @IsString()
    s: string // stands for search

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    t: Date // stands for time (represents as createdAt)

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id: string

    @IsOptional()
    @IsString()
    title: string

    @IsOptional()
    @Transform(({ value }) => transformToArray(value))
    @IsArray()
    categories: number[]

    @IsOptional()
    @IsString()
    categoryTitle: string

    @IsOptional()
    @Transform(({ value }) => transformToArray(value))
    @IsArray()
    tags: number[]

    @IsOptional()
    @IsString()
    tagTitle: string
}