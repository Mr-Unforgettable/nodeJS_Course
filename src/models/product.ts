import { RowDataPacket } from "mysql2";
import db from "../utils/database";

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
      let result;
      let queryMessage;

      if (!this.id) {
        this.id = Math.random().toString(36).substring(2, 9);
        result = await db.execute(
          `INSERT INTO shop.products (
          id,
          title, 
          price, 
          description, 
          imageUrl
        ) VALUES 
        (?, ?, ?, ?, ?)`,
          [this.id, this.title, this.price, this.description, this.imageUrl]
        );
        queryMessage = "1 row inserted into products table.";
      } else {
        result = await db.execute(
          `UPDATE shop.products SET
            title = ?,
            price = ?,
            description = ?,
            imageUrl = ?
           WHERE id = ?
          `,
          [this.title, this.price, this.description, this.imageUrl, this.id]
        );
        queryMessage = "Updated the products table.";
      }

      if (result) {
        console.log(queryMessage);
      } else {
        console.error("failed to save product");
        return;
      }
    } catch (error) {
      console.error("Error saving products:", error);
    }
  }

  static async fetchAll(): Promise<Product[]> {
    try {
      const [rows] = await db.execute(`SELECT * FROM shop.products`);
      return rows as Product[];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  static async findById(id: string): Promise<Product | undefined> {
    try {
      const [rows] = await db.execute(
        `
          SELECT * FROM shop.products
          WHERE id = ? 
      `,
        [id]
      );
      if (!Array.isArray(rows)) {
        console.error("Unexpected result from database: rows is not any array");
        return undefined;
      }
      if (rows.length === 0) {
        return undefined;
      }
      const productData = rows[0] as RowDataPacket;
      const foundProduct = new Product(
        productData.title,
        productData.imageUrl,
        productData.description,
        productData.price,
        productData.id,
      );
      return foundProduct;
    } catch (error) {
      console.error("Error finding product by ID:", error);
      return undefined;
    }
  }

  static async deleteById(id: string): Promise<void> {
    try {
      const result = await db.execute(
        `DELETE FROM shop.products
        WHERE id = ?`,
        [id]
      );

      if (result) {
        console.log("Product deleted successfully");
      } else {
        console.error("failed to delete product: Result is undefined or null");
        return;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Could not delete product");
    }
  }
}
