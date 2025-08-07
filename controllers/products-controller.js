import * as db from "../db/index.js";

export const insertProduct = async (product) => {
  const { name, description, price, stockQuantity } = product;

  if (!(name && description && price && stockQuantity)) {
    throw new Error("Invalid field provided");
  }

  if (!(parseInt(price) > 0)) {
    throw new Error("Invalid price provided");
  }

  const productCheck = await db.query(
    "SELECT * FROM products WHERE name = $1",
    [name]
  );

  if (productCheck.rows[0]) {
    throw new Error("Product already exists");
  }

  const queryText = `INSERT INTO products (name, description, price, stock_quantity)
    VALUES ($1, $2, $3, $4)
    RETURNING id,name, description, price, stock_quantity;`;

  const queryParams = [
    name,
    description,
    parseInt(price),
    parseInt(stockQuantity),
  ];

  const result = await db.query(queryText, queryParams);

  return result.rows[0];
};
