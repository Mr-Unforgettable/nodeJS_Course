import { Router } from "express";
import {
  getCart,
  getOrders,
  getProducts,
  getProduct,
  getIndex,
  getCheckout,
  postCart,
  deleteFromCart
} from "../controllers/shop";

const router = Router();

// Home route => GET
router.get("/", getIndex);

// /products => GET
router.get("/products", getProducts);

// /products/[:id] => GET
router.get("/products/:productID", getProduct);

// Cart route => GET
router.get("/cart", getCart);

// /checkout => GET
router.get("/checkout", getCheckout);

// /orders => GET
router.get("/orders", getOrders);

// /cart => POST
router.post("/cart", postCart);

// /cart => POST
router.post("/cart-delete-item", deleteFromCart);

export default router;
