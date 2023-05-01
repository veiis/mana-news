import { DataTypes } from "sequelize";
import { Column, Model, Table, Unique } from "sequelize-typescript";

@Table({ tableName: 'categories', paranoid: true })
export class Category extends Model {
    @Column({ autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER })
    id: number

    @Column({ unique: true })
    // alternativly we can user @Unique decorator imported from sequelize-typescript package
    title: string
}