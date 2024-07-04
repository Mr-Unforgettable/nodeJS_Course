import express from "express";
import path from "node:path";

import { database } from "./utils/database";

// import adminRoutes from "./routes/admin";
//import shopRoutes from "./routes/shop";
//import pageNotFound from "./routes/404";

const app = express();
const PORT = 3000;

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use("/admin", adminRoutes);
//app.use(shopRoutes);
//app.use(pageNotFound);

database(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
});