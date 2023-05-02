import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Category } from "src/modules/categories/models/category.model";
import { News } from "src/modules/news/models/news.model";

@Table({ tableName: 'newsCategories' })
export class NewsCategory extends Model {
    @ForeignKey(() => News)
    @Column
    newsId: number;

    @ForeignKey(() => Category)
    @Column
    categoryId: number
}