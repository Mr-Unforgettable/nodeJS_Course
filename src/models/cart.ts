import {
  readJSONFile,
  writeJSONFile,
  fileExists,
  initializeFile,
} from "../utils/fileOperations";
import path from "node:path";
import { Product as P } from "./product";
const mainModule = require.main || module;
const dataFilePath = path.join(
  path.dirname(mainModule.filename),
  "data",
  "cart.json"
);

interface Product {
  id: string;
  qty: number;
}

interface CartData {
  products: Product[];
  totalPrice: number;
}

export class Cart {
  static async fetchAll(): Promise<Product[]> {
    try {
      if (!(await fileExists(dataFilePath))) {
        return [];
      }

      const cart: CartData = await readJSONFile<CartData>(dataFilePath);
      return cart.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  static async addProduct(id: string, productPrice: string): Promise<void> {
    try {
      if (!(await fileExists(dataFilePath))) {
        await initializeFile(dataFilePath, { products: [], totalPrice: 0 });
      }

      let cart: CartData = await readJSONFile<CartData>(dataFilePath);

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      if (existingProduct) {
        existingProduct.qty += 1;
      } else {
        cart.products.push({ id, qty: 1 });
      }

      const price = parseFloat(productPrice);
      cart.totalPrice = parseFloat((cart.totalPrice + price).toFixed(2));

      await writeJSONFile(dataFilePath, cart);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }

  static async removeProduct(id: string, productPrice?: string): Promise<void> {
    try {
      if (!(await fileExists(dataFilePath))) {
        return;
      }

      let cart: CartData = await readJSONFile<CartData>(dataFilePath);

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );

      if (existingProductIndex === -1) {
        return;
      }

      const existingProduct = cart.products[existingProductIndex];

      if (productPrice) {
        const price = parseFloat(productPrice);
        cart.totalPrice = parseFloat(
          (cart.totalPrice - price * existingProduct.qty).toFixed(2)
        );
      }

      cart.products.splice(existingProductIndex, 1);

      await writeJSONFile(dataFilePath, cart);
    } catch (error) {
      console.error("Error deleting product from cart", error);
      throw new Error("Could not delete product from cart.");
    }
  }

  static async findById(id: string): Promise<Product | undefined> {
    try {
      if (!(await fileExists(dataFilePath))) {
        return undefined;
      }

      const cart: CartData = await readJSONFile<CartData>(dataFilePath);
      const foundProduct = cart.products.find((product) => product.id === id);

      return foundProduct;
    } catch (error) {
      console.error("Error finding product in cart:", error);
      return undefined;
    }
  }

  static async fetchCartDetails(): Promise<{
    products: Product[];
    totalPrice: number;
  }> {
    try {
      if (!(await fileExists(dataFilePath))) {
        return { products: [], totalPrice: 0 };
      }

      const cart: CartData = await readJSONFile<CartData>(dataFilePath);
      const allProducts = await P.fetchAll();

      const detailedProducts = cart.products
        .map((cartProduct) => {
          const productDetails = allProducts.find(
            (product) => product.id === cartProduct.id
          );
          return { ...productDetails, qty: cartProduct.qty };
        })
        .filter(Boolean) as Product[];

      return { products: detailedProducts, totalPrice: cart.totalPrice };
    } catch (error) {
      console.error("Error fetching cart details:", error);
      return { products: [], totalPrice: 0 };
    }
  }
}
