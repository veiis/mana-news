import { IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class GetMostViewedNewsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page: number = 1

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    limit: number = 10
}