import express from "express";
import {
  addProduct,
  removeProduct,
  getProducts,
} from "../controllers/cart-controller.js";

export const cartRouter = express.Router();

cartRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const userId = req.session.passport.user;

    const result = await addProduct(product, userId);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: "Failed to add product to cart", message: err.message });
  }
});

cartRouter.delete("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    await removeProduct(itemId);
    res.status(200).json({ message: `Product with id ${itemId} removed from cart` });
  } catch (err) {
    res.status(400).json({ error: "Failed to remove product from cart", message: err.message });
  }
});

cartRouter.get("/", async (req, res) => {
  try {
    const userId = req.session.passport.user;
    const products = await getProducts(userId);
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: "Failed to get products from cart", message: err.message });
  }
});
