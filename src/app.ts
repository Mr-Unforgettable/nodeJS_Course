import express from "express";
import path from "node:path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import flash from "connect-flash";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";
import pageNotFound from "./routes/404";

import { User } from "./models/user";
import { default as connectMongoDBSession } from "connect-mongodb-session";

// Fetch the .env config
dotenv.config();

// Express app initialization
const app = express();
const MONGO_URI = process.env.URI!;
const PORT = 3000;
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

// Configure double CSRF
const csrfProtection = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  getTokenFromRequest: (req) => req.body._csrf,
  cookieName: '__DEV-psifi.x-csrf-token',
});

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware configuration
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

// Applying CSRF protection middleware
app.use(cookieParser(process.env.CSRF_SECRET));
app.use(csrfProtection.doubleCsrfProtection);

// User session middleware
app.use(async (req, _res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    const user = await User.findById(req.session.user._id);
    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.use(flash());

// Local variables for views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken!();

  // Log the csrfToken to check whether it is being generated correctly
  console.log(res.locals.csrfToken);

  next();
});

// Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(pageNotFound);

// MongoDB connection and server startup
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();

// async function main() {
//   await mongoose.connect(MONGO_URI);
//
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}/`);
//   });
// }
//
// main().catch((error: Error) => {
//   console.log(error);
// });
