import { DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelize } from "../utils/database";
import { User } from "./user";

export class Product extends Model {
  public title!: string;
  public imageUrl?: string;
  public description?: string;
  public price?: string;
  public id!: string;

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

// Define the model attributes
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

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);