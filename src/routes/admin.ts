import { Router } from "express";
import {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from "../controllers/admin";

const router = Router();

// /admin/add-product => GET
router.get("/add-product", getAddProduct);

// /admin/add-product => POST
router.post("/add-product", postAddProduct);

// /admin/products => GET
router.get("/products", getAdminProducts);
 
// /edit-product/:productId => GET
router.get("/edit-product/:productID", getEditProduct);
 
// /edit-product => POST
router.post("/edit-product", postEditProduct);

// /admin/delete-product => DELETE
router.post("/delete-product", postDeleteProduct);

export default router;
