import { RequestHandler } from "express";
import { Product } from "../models/product";

const handleError = (res: any, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ message: "Internal server error" });
};

const renderPage = (res: any, view: string, options: any) => {
  res.render(view, options);
};

export const getIndex: RequestHandler = async (req, res, next) => {
  try {
    // Fetching the Products list using fetchAll method.
    const products = await Product.find();
    renderPage(res, "shop/index", {
      prods: products,
      pageTitle: "🛍️ Shop",
      path: "/",
    });
  } catch (error) {
    handleError(res, error, "Error fetching the Product Index:");
  }
};

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    // Fetching the Products list using fetchAll method.
    const products = await Product.find();

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

export const getProduct: RequestHandler = async (req, res, next) => {
  const productID = req.params.productID;
  try {
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

// export const getCart: RequestHandler = async (req, res, next) => {
//   try {
//     const cart = await req.user.getCart();
//     console.log(cart);
//     if (cart) {
//       renderPage(res, "shop/cart", {
//         pageTitle: "🛒 Cart",
//         path: "/cart",
//         prods: cart,
//       });
//     }
//   } catch (error) {
//     handleError(res, error, "Error fetching the Cart items");
//   }
// };
// 
// export const postCart: RequestHandler = async (req, res, next) => {
//   const productId = req.body.productId;
//   try {
//     const product = await Product.findById(productId);
//     if (product) {
//       const cart = await req.user.addToCart(product);
//       res.redirect("/cart");
//       console.log();
//       return cart;
//     } else {
//       res.status(404).json({ message: "Product not found" });
//     }
//   } catch (error) {
//     handleError(res, error, "Error adding product to cart:");
//   }
// };
// 
// export const deleteFromCart: RequestHandler = async (req, res, next) => {
//   const productId = req.body.productId;
//   try {
//     const cart = await req.user.deleteCart(productId);
//     if (cart) {
//       res.redirect("/cart");
//     } else {
//       res.status(404).send({ message: "Product not found" });
//     }
//   } catch (error) {
//     handleError(res, error, "Error deleting product from cart.");
//   }
// };
// 
// export const getOrders: RequestHandler = async (req, res, next) => {
//   try {
//     const orders = await User.getOrders(req.user._id);
//     console.log(orders);
//     if (orders) {
//       renderPage(res, "shop/orders", {
//         pageTitle: "ℹ️ orders",
//         path: "/orders",
//         orders: orders,
//       });
//     }
//   } catch (error) {
//     handleError(res, error, "Error fetching orders");
//   }
// };
// 
// export const postOrders: RequestHandler = async (req, res, next) => {
//   try {
//     const orders = await req.user.addOrder();
//     if (orders) {
//       res.redirect("/orders");
//     } else {
//       res.status(404).send({ message: "Order not found" });
//     }
//   } catch (error) {
//     handleError(res, error, "Error posting order to the page.");
//   }
// };
// 