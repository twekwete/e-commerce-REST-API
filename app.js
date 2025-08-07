import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserById, findUserByEmail } from "./controllers/user-controller.js";
import { authRouter } from './routes/auth.js';

const app = express();
const PORT = 4500;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: true, sameSite: "none" },
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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

app.use('/auth', authRouter);

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Login successful");
  console.log(req.session)
});


app.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send("Logout successful");
  });
});


app.listen(PORT, () => {
  console.log("listening at PORT: ", PORT);
});
