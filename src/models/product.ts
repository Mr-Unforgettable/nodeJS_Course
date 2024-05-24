import { fileExists, readJSONFile, writeJSONFile } from "../utils/fileOperations";
import path from "node:path";
import { Cart } from "./cart";

const mainModule = require.main || module;
const dataFilePath = path.join(
  path.dirname(mainModule.filename),
  "data",
  "products.json"
);

export interface Product {
  title: string;
  imageUrl?: string;
  description?: string;
  price?: string;
  id?: string;
}

export class Product {
  constructor(
    public title: string,
    public imageUrl?: string,
    public description?: string,
    public price?: string,
    public id?: string
  ) {}

  async save(): Promise<void> {
    try {
      const products = await Product.fetchAll() as Product[];

      if (!this.id) {
        this.id = Math.random().toString(36).substring(2, 9);

        if (this.isValid()) {
          products.push(this);
        } else {
          console.error(
            "Incomplete product information. Cannot add new product."
          );
          return;
        }
      } else {
        const index = products.findIndex((prod) => prod.id === this.id);

        if (index !== -1) {
          products[index] = this;
        } else {
          console.error("Product not found. Cannot update.");
          return;
        }
      }

      await writeJSONFile(dataFilePath, products);
    } catch (error) {
      console.error("Error saving products:", error);
    }
  }

  private isValid(): boolean {
    return (
      !!this.title && !!this.price && !!this.imageUrl && !!this.description
    );
  }

  static async fetchAll(): Promise<Product[]> {
    try {
      return await readJSONFile<Product[]>(dataFilePath);
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  static async findById(id: string): Promise<Product | undefined> {
    try {
      const products = await Product.fetchAll();
      const foundProduct = products.find(
        (product) => product.id === id
      );
      return foundProduct;
    } catch (error) {
      console.error("Error finding product by ID:", error);
      return undefined;
    }
  }

  static async deleteById(id: string): Promise<void> {
    try {
      if (!await fileExists(dataFilePath)) {
        return;
      }
      
      const products = await Product.fetchAll();
      const existingProductIndex = products.findIndex(prod => prod.id === id);

      if (existingProductIndex === -1) {
        return;
      }

      const product = products[existingProductIndex];

      if (product.price) {
        await Cart.removeProduct(id, product.price);
      } else {
        await Cart.removeProduct(id);
      }

      products.splice(existingProductIndex, 1);

      await writeJSONFile(dataFilePath, products);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Could not delete product");
    }
  }
}
