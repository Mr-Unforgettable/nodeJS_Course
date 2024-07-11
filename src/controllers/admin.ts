import { RequestHandler } from "express";
import { Product } from "../models/product";

const renderProductForm = (
  res: any,
  pageTitle: string,
  path: string,
  editing: boolean,
  product?: any
) => {
  res.render("admin/edit-product", {
    pageTitle,
    path,
    editing,
    product,
  });
};

const handleServerError = (
  res: any,
  error: any,
  message: string = "Internal Server Error"
) => {
  console.error(message, error);
  res.status(500).send(message);
};

export const getAddProduct: RequestHandler = (_req, res, _next) => {
  renderProductForm(res, "➕ Add Product", "/admin/add-product", false);
};

export const postAddProduct: RequestHandler = async (req, res, _next) => {
  const { title, imageUrl, price, description } = req.body;

  if (!title || !imageUrl || !price || !description) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const product = new Product({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
    });
    await product.save();
    res.redirect("/");
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getAdminProducts: RequestHandler = async (_req, res, _next) => {
  try {
    const adminProducts = await Product.find();
    res.render("admin/products", {
      pageTitle: "🛡️ Admin Products",
      editing: false,
      prods: adminProducts,
      path: "/admin/products",
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const getEditProduct: RequestHandler = async (req, res, _next) => {
  const editMode = req.query.edit === "true";
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productID;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect("/");
    }
    renderProductForm(
      res,
      "📝 Edit Product",
      "/admin/edit-product",
      true,
      product
    );
  } catch (error) {
    handleServerError(res, error);
  }
};

export const postEditProduct: RequestHandler = async (req, res, _next) => {
  const {
    productId: productId,
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImageUrl,
    description: updatedDescription,
  } = req.body;

  try {
    const product = await Product.findById(productId);

    if (product) {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      await product.save();
    }
    res.redirect("/admin/products");
  } catch (error) {
    handleServerError(res, error);
  }
};

export const postDeleteProduct: RequestHandler = async (req, res, _next) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findById(productId);
    if (product) {
      await Product.findByIdAndDelete(productId);
      res.redirect("/");
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
