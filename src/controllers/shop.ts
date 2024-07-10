import { RequestHandler } from "express";
import { Product } from "../models/product";
import { User } from "../models/user";

const handleError = (res: any, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ message: "Internal server error" });
};

const renderPage = (res: any, view: string, options: any) => {
  res.render(view, options);
};

export const getIndex: RequestHandler = async (_req, res, _next) => {
  try {
    // Fetching the Products list using fetchAll method.
    const products = await Product.fetchAll();
    renderPage(res, "shop/index", {
      prods: products,
      pageTitle: "🛍️ Shop",
      path: "/",
    });
  } catch (error) {
    handleError(res, error, "Error fetching the Product Index:");
  }
};

export const getProducts: RequestHandler = async (_req, res, _next) => {
  try {
    // Fetching the Products list using fetchAll method.
    const products = await Product.fetchAll();
    renderPage(res, "shop/product-list", {
      prods: products,
      pageTitle: "🛍️ All Products",
      path: "/products",
      editing: false,
    });
  } catch (error) {
    handleError(res, error, "Error fetching products:");
  }
};

export const getProduct: RequestHandler = async (req, res, _next) => {
  try {
    const productID = req.params.productID;
    const product = await Product.findById(productID);

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

export const getCart: RequestHandler = async (req, res, _next) => {
  try {
    const cart = await req.user.getCart();
    console.log(cart);
    if (cart) {
      renderPage(res, "shop/cart", {
        pageTitle: "🛒 Cart",
        path: "/cart",
        prods: cart,
      });
    }
  } catch (error) {
    handleError(res, error, "Error fetching the Cart items");
  }
};

export const postCart: RequestHandler = async (req, res, _next) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findById(productId);
    if (product) {
      const cart = await req.user.addToCart(product);
      res.redirect("/cart");
      console.log();
      return cart;
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    handleError(res, error, "Error adding product to cart:");
  }
};

// export const getOrders: RequestHandler = (_req, res, _next) => {
//   renderPage(res, "shop/orders", {
//     pageTitle: "ℹ️ orders",
//     path: "/orders",
//   });
// };
//
// export const deleteFromCart: RequestHandler = async (req, res, _next) => {
//   const prodId = req.body.productId;
//   try {
//     const product = await Product.findByPk(prodId);
//     const cartProduct = await Cart.findById(prodId);
//
//     if (product && cartProduct) {
//       await Cart.removeProduct(prodId, product.price);
//       res.redirect("/cart");
//     } else {
//       res.status(404).send({ message: "Product not found" });
//     }
//   } catch (error) {
//     handleError(res, error, "Error deleting product from cart.");
//   }
// };
