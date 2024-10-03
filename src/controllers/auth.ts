import { RequestHandler } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";

export const getLogin: RequestHandler = async (_req, res, _next) => {
  try {
    res.render("auth/login", {
      pageTitle: "🔐 Login",
      isAuthenticated: false,
      path: "/login",
    });
  } catch (error) {
    console.error("failed to open the login page.");
    res.status(500).send({ message: "Internal Server Error." });
  }
};

export const postLogin: RequestHandler = async (req, res, _next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      res.redirect("/login");
      return;
    }

    const isCorrectPasswd = await bcrypt.compare(password, user.password);

    if (!isCorrectPasswd) {
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


export const getSignup: RequestHandler = async (_req, res) => {
  try {
    res.render("auth/signup", {
      pageTitle: "📋 Sign Up",
      isAuthenticated: false,
      path: "/signup",
    });
  } catch (error) {
    console.error("Failed to fetch the signup page.");
    res.status(500).send({ message: "Internal Server Error." });
  }
};

export const postSignup: RequestHandler = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      res.status(400).send({ message: "Bad Request" });
      return;
    };

    // Check if the user already exists in the database
    const userEmail = await User.findOne({ email: email });
    if (userEmail) {
      res.redirect('/signup');
      return;
    }

    const username = email.split('@')[0];
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: username,
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error("failed to create a new user");
    res.status(500).send({
      message: "Internal Server Error."
    });
  }
};

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
