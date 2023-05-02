import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(12)
    title: string
}