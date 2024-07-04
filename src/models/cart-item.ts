import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { Cart } from "./cart";

export class CartItem extends Model {
  public id!: number;
  public quantity!: number;

  static async fetchAll(): Promise<CartItem[]> {
    try {
      const carts = await CartItem.findAll();
      return carts;
    } catch (error) {
      console.error("Error fetching carts:", error);
      return [];
    }
  }

  static async addProduct(productId: string): Promise<void> {
    try {
      const cart = await CartItem.findOne({ where: { productId } });

      if (cart) {
        cart.quantity += 1;
        await cart.save();
      } else {
        await CartItem.create({ productId, quantity: 1 });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }

  static async removeProduct(productId: string): Promise<void> {
    try {
      const cart = await CartItem.findOne({ where: { productId } });
      if (cart) {
        if (cart.quantity > 1) {
          cart.quantity -= 1;
          await cart.save();
        } else {
          await CartItem.destroy({ where: { productId } });
        }
      }

      const remainingItems = await Cart.findAll();
      if (remainingItems.length === 0) {
        await CartItem.resetCart();
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
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "cartItem",
  }
);
