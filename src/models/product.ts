import { ObjectId } from "mongodb";
import { getDB } from "../utils/database";

export class Product {
  constructor(
    public title: string,
    public imageUrl: string,
    public description: string,
    public price: number,
    public _id?: ObjectId 
  ) {}

  async save() {
    const db = getDB();
    try {
      if (this._id) {
        // Update Operation
        const updatedEntry = await db.collection("products").updateOne(
          { _id: new ObjectId(this._id) },
          {
            $set: {
              title: this.title,
              imageUrl: this.imageUrl,
              description: this.description,
              price: this.price,
            },
          }
        );
        console.log("Product updated:", updatedEntry.modifiedCount);
        if (updatedEntry.modifiedCount === 1) {
          return this;
        } else {
          throw new Error(`Product with id: ${this._id} not found.`);
        }
      } else {
        // Insert Operation
        const newEntry = await db.collection("products").insertOne(this);
        console.log("Product saved:", newEntry.insertedId);
        return newEntry.insertedId;
      }
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  }

  static async deleteById(productID: string) {
    const db = getDB();
    try {
      const deleteProduct = await db
        .collection("products")
        .deleteOne({ _id: new ObjectId(productID) });
      if (deleteProduct.deletedCount === 1) {
        console.log("Product deleted:", productID);
        return true;
      } else {
        throw new Error(`Product with id: ${productID} not found`);
      }
    } catch (error) {
      console.error("Error delete the product:", error);
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
