import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { Product } from "./product";

export class Cart extends Model {
  public id!: number;
  public productId!: number;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "cart",
  }
);
