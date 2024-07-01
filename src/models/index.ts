import { sequelize } from "../utils/database";
import { Cart } from "./cart";
import { CartItem } from "./cart-item";
import { Product } from "./product";
import { User } from "./user";

// Define associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

Cart.belongsToMany(Product, {
  through: CartItem,
});
Product.belongsToMany(Cart, {
  through: CartItem,
});

User.hasOne(Cart);
Cart.belongsTo(User);

// Export models
export { sequelize, Cart, CartItem, Product, User };
