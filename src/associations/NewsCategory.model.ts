import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Category } from "src/categories/models/category.model";
import { News } from "src/news/models/news.model";

@Table({ tableName: 'newsCategories' })
export class NewsCategory extends Model {
    @ForeignKey(() => News)
    @Column
    newsId: number;

    @ForeignKey(() => Category)
    @Column
    categoryId: number
}