import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";
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

app.use('/auth', authRouter);


app.listen(PORT, () => {
  console.log("listening at PORT: ", PORT);
});
