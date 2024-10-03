import { Router } from "express";
import {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from "../controllers/admin";
import { isAuth } from "../middleware/is_auth";

const router = Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, getAddProduct);

// /admin/add-product => POST
router.post("/add-product", isAuth, postAddProduct);

// /admin/products => GET
router.get("/products", isAuth, getAdminProducts);

// /edit-product/:productId => GET
router.get("/edit-product/:productID", isAuth, getEditProduct);

// /edit-product => POST
router.post("/edit-product", isAuth, postEditProduct);

// /admin/delete-product => DELETE
router.post("/delete-product", isAuth, postDeleteProduct);

export default router;
