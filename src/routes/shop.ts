import { Router } from "express";
import { getIndex, getProducts } from "../controllers/shop";

const router = Router();

// Home route => GET
router.get("/", getIndex);

// /products => GET
router.get("/products", getProducts);

// /products/[:id] => GET
// router.get("/products/:productID", getProduct);

// Cart route => GET
// router.get("/cart", getCart);

// /cart => POST
// router.post("/cart", postCart);

// /orders => GET
// router.get("/orders", getOrders);

// /cart => POST
// router.post("/cart-delete-item", deleteFromCart);

export default router;
