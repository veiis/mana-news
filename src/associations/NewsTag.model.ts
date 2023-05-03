import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Tag } from "src/modules/tags/models/tag.model";
import { News } from "src/modules/news/models/news.model";

@Table({ tableName: 'newsTags' })
export class NewsTag extends Model<NewsTag> {
    @ForeignKey(() => News)
    @Column
    newsId: number;

    @ForeignKey(() => Tag)
    @Column
    tagId: number
}