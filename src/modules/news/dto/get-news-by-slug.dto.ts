
import { IsNotEmpty, IsString } from "class-validator";
export class GetNewsBySlugDto {
    @IsNotEmpty()
    @IsString()
    slug: string
}
