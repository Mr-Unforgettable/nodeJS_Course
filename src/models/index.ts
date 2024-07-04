import { sequelize } from "../utils/database";
import { Cart } from "./cart";
import { CartItem } from "./cart-item";
import { Order } from "./order";
import { OrderItem } from "./order-item";
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

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });

// Export models
export { sequelize, Cart, CartItem, Product, User };
