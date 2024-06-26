//import {
//readJSONFile,
//writeJSONFile,
//fileExists,
//initializeFile,
//} from "../utils/fileOperations";
//import path from "node:path";
//import { Product as P } from "./product";

//const mainModule = require.main || module;
//const dataFilePath = path.join(
//path.dirname(mainModule.filename),
//"data",
//"cart.json"
//);

//interface Product {
//id: string;
//qty: number;
//}

//interface CartData {
//products: Product[];
//totalPrice: number;
//}

//export class Cart {
//static async fetchAll(): Promise<Product[]> {
//try {
//if (!(await fileExists(dataFilePath))) {
//return [];
//}

//const cart: CartData = await readJSONFile<CartData>(dataFilePath);
//return cart.products;
//} catch (error) {
//console.error("Error fetching products:", error);
//return [];
//}
//}

//static async addProduct(id: string, productPrice: string): Promise<void> {
//try {
//if (!(await fileExists(dataFilePath))) {
//await initializeFile(dataFilePath, { products: [], totalPrice: 0 });
//}

//let cart: CartData = await readJSONFile<CartData>(dataFilePath);

//const existingProductIndex = cart.products.findIndex(
//(prod) => prod.id === id
//);
//const existingProduct = cart.products[existingProductIndex];

//if (existingProduct) {
//existingProduct.qty += 1;
//} else {
//cart.products.push({ id, qty: 1 });
//}

//const price = parseFloat(productPrice);
//cart.totalPrice = parseFloat((cart.totalPrice + price).toFixed(2));

//await writeJSONFile(dataFilePath, cart);
//} catch (error) {
//console.error("Error updating cart:", error);
//}
//}

//static async removeProduct(id: string, productPrice?: string): Promise<void> {
//try {
//if (!(await fileExists(dataFilePath))) {
//return;
//}

//let cart: CartData = await readJSONFile<CartData>(dataFilePath);

//const existingProductIndex = cart.products.findIndex(
//(prod) => prod.id === id
//);

//if (existingProductIndex === -1) {
//return;
//}

//const existingProduct = cart.products[existingProductIndex];

//if (productPrice) {
//const price = parseFloat(productPrice);
//cart.totalPrice = parseFloat(
//(cart.totalPrice - price * existingProduct.qty).toFixed(2)
//);
//}

//cart.products.splice(existingProductIndex, 1);

//await writeJSONFile(dataFilePath, cart);
//} catch (error) {
//console.error("Error deleting product from cart", error);
//throw new Error("Could not delete product from cart.");
//}
//}

//static async findById(id: string): Promise<Product | undefined> {
//try {
//if (!(await fileExists(dataFilePath))) {
//return undefined;
//}

//const cart: CartData = await readJSONFile<CartData>(dataFilePath);
//const foundProduct = cart.products.find((product) => product.id === id);

//return foundProduct;
//} catch (error) {
//console.error("Error finding product in cart:", error);
//return undefined;
//}
//}

//static async fetchCartDetails(): Promise<{
//products: Product[];
//totalPrice: number;
//}> {
//try {
//if (!(await fileExists(dataFilePath))) {
//return { products: [], totalPrice: 0 };
//}

//const cart: CartData = await readJSONFile<CartData>(dataFilePath);
//const allProducts = await P.fetchAll();

//const detailedProducts = cart.products
//.map((cartProduct) => {
//const productDetails = allProducts.find(
//(product) => product.id === cartProduct.id
//);
//return { ...productDetails, qty: cartProduct.qty };
//})
//.filter(Boolean) as Product[];

//return { products: detailedProducts, totalPrice: cart.totalPrice };
//} catch (error) {
//console.error("Error fetching cart details:", error);
//return { products: [], totalPrice: 0 };
//}
//}
//}

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { Product } from "./product";

export class Cart extends Model {
  public id!: string;
  public qty!: number;
  Product: any;

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
        await Cart.create({ productId });
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
          await Cart.destroy();
        }
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
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
      const carts = await Cart.findAll({ include: Product });
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
      unique: true,
      autoIncrement: true,
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "cart",
  }
);
