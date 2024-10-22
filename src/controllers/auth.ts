import { RequestHandler } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";

// getLogin handlerFunction -> It fetches the login page via GET method.
export const getLogin: RequestHandler = async (req, res, _next) => {
  try {
    let errorMessage: string[] | string | null = req.flash('error');
    if (errorMessage.length > 0) {
      errorMessage = errorMessage[0]
    } else {
      errorMessage = null;
    }

    let successMessage: string[] | string | null = req.flash('success');
    if (successMessage.length > 0) {
      successMessage = successMessage[0];
    } else {
      successMessage = null;
    }

    res.render("auth/login", {
      pageTitle: "🔐 Login",
      isAuthenticated: false,
      path: "/login",
      errorMessage: errorMessage,
      successMessage: successMessage,
    });
  } catch (error) {
    console.error("failed to open the login page.");
    res.status(500).send({ message: "Internal Server Error." });
  }
};

// postLogin handlerFunction -> It handles the login with POST method
export const postLogin: RequestHandler = async (req, res, _next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
      return;
    }

    const isCorrectPasswd = await bcrypt.compare(password, user.password);

    if (!isCorrectPasswd) {
      req.flash("error", "Invalid email or password");
      res.redirect("/login");
      return;
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err: Error) => {
      console.log(err);
      res.redirect("/");
    });
  } catch (error) {
    console.error("failed to login");
    res.status(401).send({ message: "Not Authorized" });
  }
};

// getSignup handlerFunction -> It fetches the signup page via GET method
export const getSignup: RequestHandler = async (req, res) => {
  try {
    let errorMessage: string[] | string | null = req.flash('error');
    if (errorMessage.length > 0) {
      errorMessage = errorMessage[0]
    } else {
      errorMessage = null;
    }

    // Could be refactor to make it more seemless
    let successMessage: string[] | string | null = req.flash('success');
    if (successMessage.length > 0) {
      successMessage = successMessage[0];
    } else {
      successMessage = null;
    }

    res.render("auth/signup", {
      pageTitle: "📋 Sign Up",
      isAuthenticated: false,
      path: "/signup",
      successMessage: successMessage,
      errorMessage: errorMessage,
    });
  } catch (error) {
    console.error("Failed to fetch the signup page.");
    res.status(500).send({ message: "Internal Server Error." });
  }
};

// postSignup handlerFunction -> It adds and new user to the web page via POST method
export const postSignup: RequestHandler = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      req.flash('error', 'Incomplete sign up form');
      res.status(400).send({ message: "Bad Request" });
      return;
    }

    // Check if the user already exists in the database
    const userEmail = await User.findOne({ email: email });
    if (userEmail) {
      req.flash('error', 'E-mail address already exists.');
      res.redirect("/signup");
      return;
    }

    const username = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: username,
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await user.save();
    req.flash('success', 'User create successfully');
    res.redirect("/login");
  } catch (error) {
    console.error("failed to create a new user");
    res.status(500).send({
      message: "Internal Server Error.",
    });
  }
};

// postLogout handlerFunction -> It logs out the user via POST method
export const postLogout: RequestHandler = async (req, res, _next) => {
  try {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.error("Something went wrong.");
    res.status(500).send({ message: "Internal Server Error." });
  }
};
