import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from "class-validator";

export class UpdateTagDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(12)
    title: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(7)
    color: string
}