import * as db from "../db/index.js";
import { amountToCents } from "../utils/general.js";

export const addProduct = async (product, userId) => {
  const cart = await db.query(`SELECT id from user_carts WHERE user_id = $1`, [
    userId,
  ]);

  const cartId = cart.rows[0].id;

  const { productId, quantity, price } = product;

  if (!(cartId && productId && quantity && price)) {
    throw new Error("Invalid product details");
  }

  const queryText = `INSERT into cart_items (cart_id, product_id, quantity, price)
   VALUES ($1, $2, $3, $4)
   RETURNING id, cart_id, product_id, quantity, price`;

  const queryParams = [cartId, productId, quantity, amountToCents(price)];

  const result = await db.query(queryText, queryParams);

  return result.rows[0];
};

export const removeProduct = async (itemId) => {
  await db.query(
    `DELETE FROM cart_items 
     WHERE id = $1`,
    [itemId]
  );
};

export const getProducts = async (userId) => {
  const queryText = `SELECT id FROM user_carts WHERE user_id = $1`;

  const result = await db.query(queryText, [userId]);

  const cartID = result.rows[0].id;

  const cartItems = await db.query(
    `SELECT * FROM cart_items WHERE cart_id = $1`,
    [cartID]
  );

  return cartItems.rows;
};
