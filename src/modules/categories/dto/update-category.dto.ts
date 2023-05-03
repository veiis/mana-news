import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from "class-validator";

export class UpdateCategoryDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    title: string
}