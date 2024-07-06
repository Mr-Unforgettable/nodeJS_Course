import { getDB } from "../utils/database";

export class Product {
  constructor(
    public title: string,
    public imageUrl: string,
    public description: string,
    public price: number,
  ) {}

  async save() {
    const db = getDB();
    try {
      const result = await db.collection('products').insertOne(this)
      console.log("Product saved:", result);
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  }

  static async fetchAll(): Promise<Product[]> {
    const db = getDB();
    try {
      const products = await db.collection('products').find().toArray();
      console.log("Produts are:", products);
      return products;
    } catch (error) {
      console.error("Error fetching the products:", error);
      throw error;
    }
  }
}
