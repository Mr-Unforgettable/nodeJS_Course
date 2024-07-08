import { ObjectId } from "mongodb";
import { getDB } from "../utils/database";
import { Product } from "./product";

export class User {
  constructor(
    public name: string,
    public email: string,
    public cart?: any,
    public _id?: ObjectId
  ) {}

  async save() {
    // Get the database connection from the connection pool.
    const db = getDB();
    // Use the InsertOne() operation on the data and run the query.
    try {
      const newUser = await db.collection("users").insertOne({
        name: this.name,
        email: this.email,
      });
      console.log(`User saved successfully: ${newUser.insertedId}`);
      return newUser.insertedId;
    } catch (error) {
      console.error(`failed to insert a new user: ${error}`);
      throw error;
    }
  }

  async addToCart(product: Product) {
    const db = getDB();

    try {
      const cartProductIndex = this.cart.items.findIndex((item: any) => {
        return item.productId.toString() === product._id?.toString();
      });

      let newQuantity = 1;
      const updatedCartItem = [...this.cart.items];

      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItem[cartProductIndex].quantity = newQuantity;
      } else {
        // Passing the product reference along with a new overrided property
        updatedCartItem.push({
          productId:
            product._id !== null ? new ObjectId(product._id) : undefined,
          quantity: newQuantity,
        });
      }

      const updatedCart = {
        items: updatedCartItem,
      };
      const updateCart = await db.collection("users").updateOne(
        {
          _id: new ObjectId(this._id),
        },
        { $set: { cart: updatedCart } }
      );
      return updateCart;
    } catch (error) {
      console.error(`failed to add product to cart: ${error}`);
      throw error;
    }
  }

  static async findById(userId: string): Promise<User | null> {
    // Get the db connetion from the connection pool.
    const db = getDB();
    // Use the findOne() operation on the userId and run the query.
    try {
      const user = await db.collection("users").findOne({
        _id: new ObjectId(userId),
      });
      console.log("User found:", JSON.stringify(user));
      return user;
    } catch (error) {
      console.error(`user id: ${userId} was not found`);
      throw error;
    }
  }
}
