import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript'

@Table({ tableName: 'users', paranoid: true, timestamps: true, defaultScope: { attributes: { exclude: ['password'] } } })
export class User extends Model {
    @Column({ autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER })
    id: number

    @Column
    firstName: string

    @Column
    lastName: string

    @Column({ allowNull: false, unique: true })
    mobile: string

    @Column({ allowNull: false, })
    password: string

    @Column({ defaultValue: 'user', type: DataTypes.ENUM, values: ["user", "admin"] })
    role: string
}
