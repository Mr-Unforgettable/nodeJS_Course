import { RequestHandler } from "express";
import { Product } from "../models/product";

const renderProductForm = (
  res: any,
  pageTitle: string,
  path: string,
  editing: boolean,
  product?: Product
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

export const getEditProduct: RequestHandler = async (req, res, next) => {
  const editMode = req.query.edit === "true";
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productID;
  try {
    const product = await Product.findByPk(prodId);
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

export const getAdminProducts: RequestHandler = async (req, res, next) => {
  try {
    const adminProducts = await Product.findAll();
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

export const postAddProduct: RequestHandler = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  if (!title || !imageUrl || !price || !description) {
    return res.status(400).send("Missing required fields.");
  }

  try {
    await req.user.createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    res.redirect("/");
  } catch (error) {
    handleServerError(res, error);
  }
}

export const postEditProduct: RequestHandler = async (req, res, next) => {
  const {
    productId: prodId,
    title: updatedTitle,
    price: updatePrice,
    imageUrl: updatedImageUrl,
    description: updatedDescription,
  } = req.body;

  try {
    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product not found "});
    }

    product.title = updatedTitle;
    product.price = updatePrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDescription;
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    handleServerError(res, error);
  }
}

export const postDeleteProduct: RequestHandler = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    await product.destroy();
    res.redirect("/");
  } catch (error) {
    handleServerError(res, error);
  }
}