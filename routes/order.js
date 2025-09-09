import express from "express";
import { fetchOrder, insertOrder } from "../controllers/order-controller.js";

export const orderRouter = express.Router();

orderRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await fetchOrder(id);
    res.status(200).json({ "Order data": result });
  } catch (err) {
    res.status(404).json({ "Failed to fetch order data": err.message });
  }
});

orderRouter.post("/", async (req, res) => {
  try {
    const order = req.body;
    const userId = req.session.passport.user;
    const result = await insertOrder(userId,order);
    res.status(200).json({ "Order data": result });
  } catch (err) {
    res.status(404).json({ "Failed to fetch order data": err.message });
  }
});