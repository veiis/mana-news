import { DataTypes } from "sequelize";
import { Column, Model, Table, BelongsToMany } from "sequelize-typescript";
import { NewsTag } from "src/associations/NewsTag.model";
import { News } from "src/modules/news/models/news.model";

@Table({ tableName: 'tags', paranoid: true })
export class Tag extends Model<Tag> {
    @Column({ autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER })
    id: number;

    @Column({ allowNull: false })
    title: string

    @Column({ defaultValue: "#eee" })
    color: string

    @BelongsToMany(() => News, () => NewsTag)
    news: News[]
};