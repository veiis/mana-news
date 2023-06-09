import { DataTypes } from 'sequelize';
import { Model, Column, Table, Length, BelongsToMany, ForeignKey, HasMany } from "sequelize-typescript";
import { NewsCategory } from 'src/associations/NewsCategory.model';
import { NewsTag } from 'src/associations/NewsTag.model';
import { Category } from 'src/modules/categories/models/category.model';
import { Tag } from 'src/modules/tags/models/tag.model';

@Table({ tableName: 'news', paranoid: true, timestamps: true })
export class News extends Model<News> {
    @Column({ autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER })
    id: number

    @Length({ min: 6, max: 255 })
    @Column({ allowNull: false })
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

    @Column({ defaultValue: false })
    isTrend: boolean

    @Column({ allowNull: false })
    slug: string

    @BelongsToMany(() => Category, () => NewsCategory)
    categories: Category[]

    @BelongsToMany(() => Tag, () => NewsTag)
    tags: Tag[]
}
