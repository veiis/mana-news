import { IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class GetPopularNewsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page: number = 1

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    limit: number = 10
}