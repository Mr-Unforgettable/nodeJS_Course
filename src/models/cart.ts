import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Cart extends Model {
  public id!: number;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "cart",
  }
);
