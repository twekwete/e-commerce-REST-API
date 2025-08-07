import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";
import { authRouter } from './routes/auth.js';
import { productsRouter } from './routes/products.js';
import { checkIfAuthorized } from './middlewares/auth-middleware.js';
// import cors from 'cors';

const app = express();
const PORT = 4500;


// app.use(
//   cors({
//     origin: "http://localhost:3000", 
//     credentials: true,             
//   })
// );

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: "lax" },
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/products',checkIfAuthorized,productsRouter);

app.listen(PORT, () => {
  console.log("listening at PORT: ", PORT);
});


