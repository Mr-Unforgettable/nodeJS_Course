import express from "express";
import path from "node:path";

import { closeDB, connectDB } from "./utils/database";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import pageNotFound from "./routes/404";

import { User } from "./models/user";

const app = express();
const PORT = 3000;

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("668bb17b65d7f8ef6b383611");
    if (user) {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    }
  } catch (error) {
    console.error(`failed to create user: ${error}`);
    next(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(pageNotFound);

connectDB(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
});

process.on("SIGINT", async () => {
  try {
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  try {
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});
