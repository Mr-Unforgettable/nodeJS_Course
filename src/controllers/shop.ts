import { RequestHandler } from "express";
import { Product } from "../models/product";
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

export const getOrders: RequestHandler = async (req, res, _next) => {
  try {
    const orders = await req.user.getOrders({ include: Product });

    if (orders) {
      console.log(orders);
      renderPage(res, "shop/orders", {
        pageTitle: "ℹ️ orders",
        path: "/orders",
        orders: orders,
      });
    } else {
      res.status(404).send({ message: "Orders not found. " });
    }
  } catch (error) {
    handleError(res, error, "Error fetching the order items");
  }
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
          productId: productId,
        },
      });

      if (updatedCartItem) {
        newQuantity = updatedCartItem.quantity + 1;
        await updatedCartItem.update({ quantity: newQuantity });
      } else {
        await cart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      }
    } else {
      // If product does not exist in cart, add it
      const specificProduct = await Product.findByPk(productId);
      if (specificProduct) {
        await cart.addProduct(specificProduct, {
          through: { quantity: newQuantity },
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
    const cartProduct = await CartItem.findOne({ where: { productId } });

    if (product && cartProduct) {
      await CartItem.removeProduct(productId);
      res.redirect("/cart");
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    handleError(res, error, "Error deleting product from cart.");
  }

  // try {
  //   const cart = await req.user.getCart();

  //   const products = await cart.getProducts({ where: { id: productId } });
  //   if (products) {
  //     const product = products[0];
  //     const updatedCart = await product.CartItem.destroy();
  //     res.redirect("/cart");
  //     return updatedCart;
  //   } else {
  //     res.status(404).send({ message: "Product not found" });
  //   }
  // } catch (error) {
  //   console.error("Error deleting the cart:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
};

export const postOrder: RequestHandler = (req, res, _next) => {
  const productId = req.body.productId;
  let fetchedCart: any;

  req.user
    .getCart()
    .then((cart: any) => {
      fetchedCart = cart;
      return cart.getProducts({ where: productId });
    })
    .then((products: any) => {
      return req.user
        .createOrder()
        .then((order: any) => {
          return order.addProduct(
            products.map((product: any) => {
              product.orderItem = { quantity: product.CartItem.quantity };
              return product;
            }),
          );
        })
        .catch((err: any) => console.log(err));
    })
    .then(() => {
      fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err: any) => console.log(err));
};

