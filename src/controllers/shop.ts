import { RequestHandler } from "express";
import { Product } from "../models/product";
import { Cart } from "../models/cart";
import { CartItem } from "../models/cart-item";

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

export const getCart: RequestHandler = async (req, res, _next) => {
  try {
    const cart = await req.user.getCart();
    console.log("Cart info:", cart);

    const cartDetails = await cart.getProducts();
    if (cartDetails) {
      renderPage(res, "shop/cart", {
        pageTitle: "🛒 Cart",
        path: "/cart",
        prods: cartDetails,
      });
    }
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
    const cart = await req.user.getCart(); // Assuming req.user.getCart() returns the user's cart
    let product;
    
    // Check if the product already exists in the cart
    const products = await cart.getProducts({ where: { id: productId } });
    if (products.length > 0) {
      product = products[0];
    }
    
    let newQuantity = 1;
    
    // If product already exists in cart, update its quantity
    if (product) {
      const updatedCartItem = await CartItem.findOne({
        where: {
          cartId: cart.id,
          productId: productId
        }
      });

      if (updatedCartItem) {
        newQuantity = updatedCartItem.quantity + 1;
        await updatedCartItem.update({ quantity: newQuantity });
      } else {
        await cart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      }
    } else {
      // If product does not exist in cart, add it
      const specificProduct = await Product.findByPk(productId);
      if (specificProduct) {
        await cart.addProduct(specificProduct, {
          through: { quantity: newQuantity }
        });
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    }
    
    res.redirect("/cart"); // Redirect to cart page after successful addition/update
  } catch (error) {
    console.error("Error updating the cart:", error);
    res.status(500).json({ message: "Internal server error" }); // Handle error response
  }
};

export const deleteFromCart: RequestHandler = async (req, res, _next) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findByPk(productId);
    const cartProduct = await Cart.findOne({ where: { productId } });

    if (product && cartProduct) {
      await CartItem.removeProduct(productId);
      res.redirect("/cart");
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    handleError(res, error, "Error deleting product from cart.");
  }
};
