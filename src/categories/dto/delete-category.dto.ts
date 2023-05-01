import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class DeleteCategoryDto {
    @IsNotEmpty()
    @IsNumberString()
    id: string
}