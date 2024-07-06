import { ObjectId } from "mongodb";
import { getDB } from "../utils/database";

export class Product {
  constructor(
    public title: string,
    public imageUrl: string,
    public description: string,
    public price: number
  ) {}

  async save() {
    const db = getDB();
    try {
      const result = await db.collection("products").insertOne(this);
      console.log("Product saved:", result.insertedId);
      return result.insertedId;
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  }

  static async fetchAll(): Promise<Product[]> {
    const db = getDB();
    try {
      const products = await db.collection("products").find().toArray();
      console.log("Produts are:", products);
      return products;
    } catch (error) {
      console.error("Error fetching the products:", error);
      throw error;
    }
  }

  static async findById(productID: string): Promise<Product | null> {
    const db = getDB();
    try {
      const product = await db
        .collection("products")
        .findOne({ _id: new ObjectId(productID) });
      console.log("Product found:", product);
      return product;
    } catch (error) {
      console.error("Error find the product of specific id:", error);
      throw error;
    }
  }
}
