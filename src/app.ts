import express from "express";
import path from "node:path";
import mongoose from "mongoose";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import pageNotFound from "./routes/404";

// import { User } from "./models/user";

dotenv.config();

const app = express();
const uri = process.env.URI!;
const PORT = 3000;

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById("668bb17b65d7f8ef6b383611");
//     if (user) {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     }
//   } catch (error) {
//     console.error(`failed to create user: ${error}`);
//     next(error);
//   }
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
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