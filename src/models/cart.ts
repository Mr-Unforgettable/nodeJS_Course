import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { Product } from "./product";

export class Cart extends Model {
  public id!: string;
  public qty!: number;
  public Product!: any;
  // public price!: number;
  // public productId!: number;
  // public Product!: Product;

  static async fetchAll(): Promise<Cart[]> {
    try {
      const carts = await Cart.findAll();
      return carts;
    } catch (error) {
      console.error("Error fetching carts:", error);
      return [];
    }
  }

  static async addProduct(productId: string): Promise<void> {
    try {
      const cart = await Cart.findOne({ where: { productId } });

      if (cart) {
        cart.qty += 1;
        await cart.save();
      } else {
        await Cart.create({ productId, qty: 1 });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }

  static async removeProduct(productId: string): Promise<void> {
    try {
      const cart = await Cart.findOne({ where: { productId } });
      if (cart) {
        if (cart.qty > 1) {
          cart.qty -= 1;
          await cart.save();
        } else {
          await Cart.destroy({ where: { productId } });
        }
      }

      const remainingItems = await Cart.findAll();
      if (remainingItems.length === 0) {
        await Cart.resetCart();
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  }

  static async resetCart(): Promise<void> {
    try {
      await sequelize.query("TRUNCATE TABLE cart");
      await sequelize.query("ALTER TABLE cart AUTO_INCREMENT = 1");
    } catch (error) {
      console.error("Error resetting cart:", error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Cart | null> {
    try {
      const cart = await Cart.findByPk(id);
      return cart;
    } catch (error) {
      console.error("Error finding cart by ID:", error);
      return null;
    }
  }

  static async fetchCartDetails(): Promise<{
    products: Product[];
    totalPrice: number;
  }> {
    try {
      const carts = await Cart.findAll({
        include: { model: Product, as: "products" },
        // include: "products",
      });
      const totalPrice = carts.reduce(
        (total, cart) => total + cart.qty * cart.Product.price,
        0
      );
      const products = carts.map((cart) => cart.Product);
      return { products, totalPrice };
    } catch (error) {
      console.error("Error fetching cart details:", error);
      return { products: [], totalPrice: 0 };
    }
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // price: {
    //   type: DataTypes.DOUBLE,
    //   allowNull: false,
    // },
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

Product.belongsToMany(Cart, {
  through: "Cart",
  foreignKey: "productId",
  as: "cart",
});
Cart.belongsToMany(Product, {
  through: "Cart",
  foreignKey: "productId",
  as: "products",
});
