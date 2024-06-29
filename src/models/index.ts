import { sequelize } from "../utils/database";
import { Cart } from "./cart";
import { CartItem } from "./cart-item";
import { Product } from "./product";
import { User } from "./user";

// Define associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Cart.belongsToMany(Product, {
  through: CartItem,
  foreignKey: "cartId",
  as: "products",
});
Product.belongsToMany(Cart, {
  through: CartItem,
  foreignKey: "productId",
  as: "carts",
});
Cart.belongsTo(User);
User.hasMany(Product);
User.hasOne(Cart);

// Export models
export { sequelize, Cart, CartItem, Product, User };
