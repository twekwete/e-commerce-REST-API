import express from "express";
import { registerUser } from "../controllers/auth-controller.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserByEmail,findUserById } from "../controllers/user-controller.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
   const user = await registerUser(req.body);
   res.status(200).json({"User registered successfully":user})
  } catch (err) {
    res.status(400).json({"User registered failed":err.message})
  }
});

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
        return cb(null, false);
      }

      if (user.password != password) {
        return cb(null, false);
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);

 authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Login successful");
  console.log(req.session)
});


 authRouter.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send("Logout successful");
  });
});
