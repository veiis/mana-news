import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Category } from "src/modules/categories/models/category.model";
import { Video } from "src/modules/videos/models/video.model";

@Table({ tableName: 'videoCategories' })
export class VideoCategory extends Model {
    @ForeignKey(() => Video)
    @Column
    videoId: number;

    @ForeignKey(() => Category)
    @Column
    categoryId: number
}