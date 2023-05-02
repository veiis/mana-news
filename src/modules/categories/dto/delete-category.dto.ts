import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteCategoryDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    id: string
}