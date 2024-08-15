import express, { NextFunction, Request, Response } from "express";
import path from "node:path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";
import pageNotFound from "./routes/404";

import { User } from "./models/user";

dotenv.config();

const app = express();
const uri = process.env.URI!;
const PORT = 3000;

const MongoDBStore = connectMongoDBSession(session);

var store = new MongoDBStore({
  uri: uri,
  collection: 'sessions',
});

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_TOKEN!,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(async (req, _res, next) => {
  try {
    const user = await User.findById("6690e25c129cb3961870bdc4");
    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    console.log(`Internal Server Error: ${error}`);
    throw error;
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(pageNotFound);

async function main() {
  await mongoose.connect(uri);

  const testUser = await User.findOne();
  if (!testUser) {
    const user = new User({
      name: "TestUser1",
      email: "testuser1@test.url",
      cart: {
        items: [],
      },
    });

    await user.save();
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

main().catch((error: Error) => {
  console.log(error);
});
