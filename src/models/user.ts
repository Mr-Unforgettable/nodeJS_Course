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

      // Check if the cart contains the items
      if (cartProductIndex >= 0) {
        // Update the quantity
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        // Put the new updated quantity
        updatedCartItem[cartProductIndex].quantity = newQuantity;
      } else {
        // Passing the product reference along with a new overrided property
        updatedCartItem.push({
          productId:
            product._id !== null ? new ObjectId(product._id) : undefined,
          quantity: newQuantity,
        });
      }

      // Put the new update cart array
      const updatedCart = {
        items: updatedCartItem,
      };

      // Running the update query
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

  async getCart(): Promise<any> {
    const db = getDB();
    try {
      const productIDs = this.cart.items.map((item: any) => {
        return item.productId;
      });

      const products = await db
        .collection("products")
        .find({ _id: { $in: productIDs } })
        .toArray();

      if (products) {
        return products.map((product: any) => {
          return {
            ...product,
            quantity: this.cart.items.find((iter: any) => {
              return iter.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      }
    } catch (error) {
      console.error(`Cart not found: ${error}`);
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
