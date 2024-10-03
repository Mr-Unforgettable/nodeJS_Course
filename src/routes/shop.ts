import { Router } from "express";
import {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  deleteFromCart,
  getOrders,
  postOrders
} from "../controllers/shop";

import { isAuth } from "../middleware/is_auth";

const router = Router();

// Home route => GET
router.get("/", isAuth, getIndex);

// /products => GET
router.get("/products", getProducts);

// /products/[:id] => GET
router.get("/products/:productID", isAuth, getProduct);

// Cart route => GET
router.get("/cart", isAuth, getCart);

// /cart => POST
router.post("/cart", isAuth, postCart);

// /cart => POST
router.post("/cart-delete-item", isAuth, deleteFromCart);

// /orders => GET
router.get("/orders", isAuth, getOrders);

// /orders => POST
router.post("/create-order", isAuth, postOrders);

export default router;
