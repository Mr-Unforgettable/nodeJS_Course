import express from "express";
import path from "node:path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";
import pageNotFound from "./routes/404";

import { User } from "./models/user";
import { default as connectMongoDBSession } from "connect-mongodb-session";

dotenv.config();

const app = express();
const uri = process.env.URI!;
const PORT = 3000;
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: uri,
  collection: "sessions",
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

// Configure double CSRF
const csrfProtection = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  getTokenFromRequest: (req) => req.body._csrf,
});

// Applying CSRF protection middleware
app.use(cookieParser(process.env.CSRF_SECRET));
app.use(csrfProtection.doubleCsrfProtection);

app.use(async (req, _res, next) => {
  if (!req.session.user) {
    return next();
  }

  const user = await User.findById(req.session.user._id);
  if (user) {
    req.user = user;
  }
  next();
});

app.use(async (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = (req.csrfToken as () => string)();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(pageNotFound);

async function main() {
  await mongoose.connect(uri);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

main().catch((error: Error) => {
  console.log(error);
});
