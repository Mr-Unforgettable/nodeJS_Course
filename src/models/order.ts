import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Order extends Model {
    public id!: number;
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,   
    },
}, {
    sequelize,
    tableName: 'orders'
});