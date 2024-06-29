import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Product extends Model {
  public title!: string;
  public imageUrl?: string;
  public description?: string;
  public price?: string;
  public id!: number;

  static async fetchAll(): Promise<Product[]> {
    try {
      const products = await Product.findAll();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);

