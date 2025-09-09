import express from "express";
import { registerUser } from "../controllers/auth-controller.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  findUserByEmail,
  findUserById,
} from "../controllers/user-controller.js";
import { isPasswordValid } from "../utils/password.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";

export const authRouter = express.Router();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    cb
  ) {
    try {
      const user = await findUserByEmail(email);

      if (!user) {
        return cb(null, false, { message: "Incorrect email." });
      }

      const validPassword = await isPasswordValid(password, user.password);

      if (!validPassword) {
        return cb(null, false, { message: "Incorrect password." });
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4500/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const user = await findUserByEmail(profile.emails[0].value);

        if (!user) {
          return cb(null, false, { message: "Incorrect email." });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.status(200).json({ msg: "Login success" });
  }
);

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Login successful");
  console.log(req.session);
});

authRouter.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send("Logout successful");
  });
});

authRouter.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(200).json({ "User registered successfully": user });
  } catch (err) {
    res.status(400).json({ "User registered failed": err.message });
  }
});
