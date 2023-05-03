import { DataTypes } from "sequelize";
import { Column, Model, Table, BelongsToMany } from "sequelize-typescript";
import { VideoCategory } from "src/associations/VideoCategory.model";
import { Category } from "src/modules/categories/models/category.model";

@Table({ tableName: 'videos', paranoid: true, timestamps: true })
export class Video extends Model<Video> {
    @Column({ autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER })
    id: number;

    @Column({ allowNull: false })
    title: string

    @Column({ allowNull: true })
    link: string

    @Column({ allowNull: false })
    slug: string

    @BelongsToMany(() => Category, () => VideoCategory)
    categories: Category[]
};