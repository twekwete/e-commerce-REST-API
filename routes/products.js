import express from "express";
import {
  insertProduct,
  fetchProducts,
  fetchProduct,
  deleteProduct,
  updateProduct
} from "../controllers/products-controller.js";

export const productsRouter = express.Router();

productsRouter.post("/", async (req, res) => {
  try {
    const result = await insertProduct(req.body);
    res.status(201).json({ "Product created successfully": result });
  } catch (err) {
    res.status(400).json({ "failed to create product": err.message });
  }
});

productsRouter.get("/", async (req, res) => {
  try {
    const result = await fetchProducts();
    res.status(200).json({ "Products fetched successfully": result });
  } catch (err) {
    res.status(404).json({ "failed to fetch products": err.message });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchProduct(id);
    res.status(200).json({ "Product fetched successfully": result });
  } catch (err) {
    res.status(404).json({ "failed to fetch product": err.message });
  }
});

productsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedProduct = await updateProduct(id, updatedFields);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
});


productsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);
    res.status(200).json({ "Product deleted successfully": result });
  } catch (err) {
    res.status(404).json({ "Failed to delete product": err.message });
  }
});


