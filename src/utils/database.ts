import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.URI!;
let _db: any;
let _client: MongoClient | null = null;

export const connectDB = async(callback?: any) => {
  if (_db) return _db;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("shop").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    callback();
    _client = client;
    _db = client.db();
    return _db;
    // Get the server address and any other relevant client information
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

export const closeDB = async() => {
  try {
    if (_client) {
      await _client.close();
      console.log("MongoDB connection closed.");
      _db = null;
      _client = null;
    }
  } catch (error: any) {
    console.error("Error closing MongoDB connection:", error);
  }
};
