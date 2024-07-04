import { Router } from "express";
import {
  getCart,
  getOrders,
  getProducts,
  getProduct,
  getIndex,
  postCart,
  deleteFromCart,
  postOrder
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

// /orders => GET
router.get("/orders", getOrders);

// /orders => POST
router.post("/create-order", postOrder);

// /cart => POST
router.post("/cart", postCart);

// /cart => POST
router.post("/cart-delete-item", deleteFromCart);

export default router;
