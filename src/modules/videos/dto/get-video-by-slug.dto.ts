
import { IsNotEmpty, IsString } from "class-validator";
export class GetVideoBySlugDto {
    @IsNotEmpty()
    @IsString()
    slug: string
}
