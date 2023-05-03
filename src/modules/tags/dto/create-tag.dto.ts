import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class CreateTagDto {
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