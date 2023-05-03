import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsArray, ArrayMinSize } from "class-validator";
import { transformToArray } from "src/tools/transformToArray";

export class CreateVideoDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    title: string

    @Transform(({ value }) => transformToArray(value))
    @IsArray()
    @ArrayMinSize(1)
    categories: number[]
}