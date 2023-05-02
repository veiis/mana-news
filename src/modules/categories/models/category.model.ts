import { DataTypes } from "sequelize";
import { Column, Model, Table, BelongsToMany, HasMany } from "sequelize-typescript";
import { NewsCategory } from "src/associations/NewsCategory.model";
import { News } from "src/modules/news/models/news.model";

@Table({ tableName: 'categories', paranoid: true })
export class Category extends Model<Category> {
    @Column({ autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER })
    id: number;

    @Column({ unique: true })
    // alternativly we can user @Unique decorator imported from sequelize-typescript package
    title: string

    @BelongsToMany(() => News, () => NewsCategory)
    news: News[]
};