import { getDB } from "../utils/database";

export class Product {
  constructor(
    public title: string,
    public price: number,
    public description: string,
    public imageUrl: string
  ) {}

  async save() {
    const db = getDB();
    try {
      const result = await db.collection('products').insertOne(this)
      console.log("Product saved:", result);
    } catch (error: any) {
      console.error("Error saving product:", error);
      throw error;
    }
  }
}
