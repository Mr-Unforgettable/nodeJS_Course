import express from "express";
import path from "node:path";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import pageNotFound from "./routes/404";

import pool from './utils/database';

const app = express();
const PORT = 3000;

pool.execute(`SELECT * FROM shop.products`)
  .then((results) => {
    console.log(results[0], results[1]);
  })
  .catch(error => {
    console.error('Error fetching table from the database', error);
  })

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(pageNotFound);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
