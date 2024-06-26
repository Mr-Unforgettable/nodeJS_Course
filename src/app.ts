import express from "express";
import path from "node:path";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import pageNotFound from "./routes/404";

import { sequelize } from "./utils/database";
import { Cart } from "./models/cart";
import { Product } from "./models/product";

const app = express();
const PORT = 3000;

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(pageNotFound);

// Models associations
Product.belongsToMany(Cart, { through: 'Cart'});
Cart.belongsToMany(Product, { through: 'Cart'});

sequelize
  .sync()
  // .sync({ force: true })
  .then((result) => {
    // console.log(result);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
