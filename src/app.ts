import express, { NextFunction, Request, Response } from "express";
import path from "node:path";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import pageNotFound from "./routes/404";

import { sequelize } from "./utils/database";
import { User } from "./models/user";
import { Product } from "./models";

const app = express();
const PORT = 3000;

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to find the user and attach to the request object
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(1, { include: Product});
    if (user) {
      console.log("User found:", user);
      req.user = user;
    } else {
      console.log("User not found");
    }
    next();
  } catch (err) {
    console.error("Unable to find the user", err);
    next(err); // Ensure the middleware continues in case of error
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(pageNotFound);

(async () => {
  try {
    // await sequelize.sync({ force: true });  // Remove this line in production build.
    await sequelize.sync();

    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({
        name: "TestSubject1",
        email: "testsub1@email.test",
      });
    }
    console.log("User created or found:", user);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during Sequalize sync or user creation:", error);
  }
})();
