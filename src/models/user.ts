import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { Cart } from "./cart";

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;

 // public async createCart(): Promise<Cart> {
 //   try {
 //     const user = await User.findByPk(this.id);
 //     if (!user) {
 //       throw new Error("User not found!");
 //     }
 //     const cart = await Cart.create({ userId: this.id });
 //     return cart;
 //   } catch (error) {
 //     console.error("Error creating cart:", error);
 //     throw error;
 //   }
 // }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
