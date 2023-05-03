import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, IsDate } from "class-validator";
import { Transform } from "class-transformer";

export class GetSlideshowNewsDto {
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
}