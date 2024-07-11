import { Router } from "express";
import {
getIndex,
getProducts,
getProduct,
// getCart,
// postCart,
// deleteFromCart,
// getOrders,
// postOrders
} from "../controllers/shop";

const router = Router();

// Home route => GET
router.get("/", getIndex);

// /products => GET
router.get("/products", getProducts);

// /products/[:id] => GET
router.get("/products/:productID", getProduct);
// 
// // Cart route => GET
// router.get("/cart", getCart);
// 
// // /cart => POST
// router.post("/cart", postCart);
// 
// // /cart => POST
// router.post("/cart-delete-item", deleteFromCart);
// 
// // /orders => GET
// router.get("/orders", getOrders);
// 
// // /orders => POST
// router.post("/create-order", postOrders);

export default router;
