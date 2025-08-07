import express from "express";
import { registerUser } from "../controllers/auth-controller.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
   const user = await registerUser(req.body);
   res.status(200).json({"User registered successfully":user})
  } catch (err) {
    res.status(400).json({"User registered failed":err.message})
  }
});
