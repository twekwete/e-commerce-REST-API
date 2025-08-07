import express from "express";
import { insertProduct } from "../controllers/products-controller.js";

export const productsRouter = express.Router();

productsRouter.post("/", async (req, res) => {
  try {
    const result = await insertProduct(req.body);
    res.status(201).json({ "Product created successfully": result });
  } catch (err) {
    res.status(400).json({ "failed to create product": err.message });
  }
});

productsRouter.get("/", (req, res) => {});

productsRouter.get("/:id", (req, res) => {});

productsRouter.put("/:id", (req, res) => {});

productsRouter.patch("/:id/:action", (req, res) => {});

productsRouter.delete("/:id", (req, res) => {});
