import { RequestHandler } from "express";
import { Product } from "../models/product";
import { Cart } from "../models/cart";
import { sequelize } from "../utils/database";

const handleError = (res: any, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ message: "Internal server error" });
};

const renderPage = (res: any, view: string, options: any) => {
  res.render(view, options);
};

export const getProducts: RequestHandler = async (_req, res, _next) => {
  try {
    // Fetching the Products list using fetchAll method.
    const products = await Product.fetchAll();
    renderPage(res, "shop/product-list", {
      prods: products,
      pageTitle: "🛍️ All Products",
      path: "/products",
      hasProducts: products.length > 0,
      editing: false,
    });
  } catch (error) {
    handleError(res, error, "Error fetching products:");
  }
};

export const getProduct: RequestHandler = async (req, res, _next) => {
  try {
    const prodID = req.params.productID;
    const product = await Product.findByPk(prodID);

    if (product) {
      renderPage(res, "shop/product-details", {
        product: product,
        pageTitle: `ℹ️ ${product.title} `,
        path: "product-details",
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    handleError(res, error, "Error fetching products:");
  }
};

export const getIndex: RequestHandler = async (_req, res, _next) => {
  try {
    // Fetching the Products list using fetchAll method.
    const products = await Product.fetchAll();
    renderPage(res, "shop/index", {
      prods: products,
      pageTitle: "🛍️ Shop",
      path: "/",
      hasProducts: products.length > 0,
    });
  } catch (error) {
    handleError(res, error, "Error fetching the Product Index:");
  }
};

export const getCart: RequestHandler = async (_req, res, _next) => {
  try {
    const cartProducts = await Cart.fetchAll();
    const allProducts = await Product.fetchAll();
    const cartDetails: { productData: Product; qty: number }[] = [];

    for (const cartProduct of cartProducts) {
      const productData = allProducts.find(
        (prod) => prod.id === cartProduct.id
      );
      if (productData) {
        cartDetails.push({ productData, qty: cartProduct.qty });
      }
    }
    renderPage(res, "shop/cart", {
      pageTitle: "🛒 Cart",
      path: "/cart",
      prods: cartDetails 
    });
    //const { products, totalPrice } = await Cart.fetchCartDetails(); 
    //renderPage(res, "shop/cart", {
    //  pageTitle: "🛒 Cart",
    //  path: "/cart",
    //  prods: products.map(productData => ({
    //    productData,
    //    qty: 1
    //  })),
    //  totalPrice,
    //});
  } catch (error) {
    handleError(res, error, "Error fetching the Cart items");
  }
};

export const getCheckout: RequestHandler = (_req, res, _next) => {
  renderPage(res, "shop/checkout", {
    pageTitle: "ℹ️ Checkout",
    path: "/checkout",
  });
};

export const getOrders: RequestHandler = (_req, res, _next) => {
  renderPage(res, "shop/orders", {
    pageTitle: "ℹ️ orders",
    path: "/orders",
  });
};

export const postCart: RequestHandler = async (req, res, _next) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findByPk(productId);
    if (product) {
      await Cart.addProduct(productId);
      res.redirect("/cart");
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    handleError(res, error, "Error adding product to cart:");
  }
};

export const deleteFromCart: RequestHandler = async (req, res, _next) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findByPk(productId);
    const cartProduct = await Cart.findOne({ where: { productId } });

    if (product && cartProduct) {
      await Cart.removeProduct(productId);
      res.redirect("/cart");
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    handleError(res, error, "Error deleting product from cart.");
  }
};