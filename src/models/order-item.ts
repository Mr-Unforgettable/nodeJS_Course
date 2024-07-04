import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class OrderItem extends Model {
    public id!: number;
    public quantity!: number;
}

OrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,   
    },
    quantity: {
        type: DataTypes.INTEGER
    },
}, {
    sequelize,
    tableName: 'orderItem'
});