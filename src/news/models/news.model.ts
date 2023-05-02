import { DataTypes } from 'sequelize';
import { Model, Column, Table, Length, BelongsToMany, ForeignKey, HasMany } from "sequelize-typescript";
import { NewsCategory } from 'src/associations/NewsCategory.model';
import { Category } from 'src/categories/models/category.model';

@Table({ tableName: 'news', paranoid: true, timestamps: true })
export class News extends Model<News> {
    @Column({ autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER })
    id: number

    @Length({ min: 6, max: 255 })
    @Column({ allowNull: false, })
    title: string

    @Length({ min: 6, max: 1500 })
    @Column({ allowNull: false, })
    description: string

    @Column({ allowNull: true })
    cover: string

    @Column({ defaultValue: 0 })
    views: number

    @Column({ defaultValue: 0 })
    likes: number

    @Column({ defaultValue: false })
    isSlideshow: boolean

    @BelongsToMany(() => Category, () => NewsCategory)
    categories: Category[]
}
