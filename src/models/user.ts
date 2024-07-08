import { ObjectId } from "mongodb";
import { getDB } from "../utils/database";

export class User {
  constructor(public user: string, public email: string, _id: ObjectId) {}

  async save() {
    // Get the database connection from the connection pool.
    const db = getDB();
    // Use the InsertOne() operation on the data and run the query.
    try {
      const newUser = await db.collection("users").insertOne({
        user: this.user,
        email: this.email,
      });
      console.log(`User saved successfully: ${newUser.insertedId}`);
      return newUser.insertedId;
    } catch (error) {
      console.error(`failed to insert a new user: ${error}`);
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
