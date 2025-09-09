import * as db from "../db/index.js";

export const fetchOrder = async (id) => {
  const queryText = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      o.status,
      o.total,
      o.created_at,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price
        )
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = $1
    GROUP BY o.id
  `;

  const result = await db.query(queryText, [id]);
  return result.rows[0];
};



export const insertOrder = async (userId, order) => {
  const {
    orderDate,
    status,
    totalAmount,
    shippingAddress,
    createdAt,
    updatedAt,
  } = order;

  if (
    !(
      userId &&
      orderDate &&
      status &&
      totalAmount &&
      shippingAddress &&
      createdAt &&
      updatedAt
    )
  ) {
    throw new Error("Invalid field provided");
  }

  const queryText = `
    INSERT INTO orders (user_id, order_date, status, total_amount, shipping_address, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, order_date, status, total_amount, shipping_address, created_at, updated_at
  `;

  const totalAmountAsCents = parseInt(parseFloat(totalAmount) * 100, 10);

  const queryParams = [
    userId,
    orderDate,
    status,
    totalAmountAsCents,
    shippingAddress,
    createdAt,
    updatedAt,
  ];

  const orderResult = await db.query(queryText, queryParams);
  const orderId = orderResult.rows[0].id;

  const userCartResult = await db.query(
    `SELECT id FROM user_carts WHERE user_id = $1`,
    [userId]
  );

  if (userCartResult.rowCount === 0) {
    throw new Error("No cart found for user");
  }

  const userCartId = userCartResult.rows[0].id;

  const cartItemsResult = await db.query(
    `SELECT * FROM cart_items WHERE cart_id = $1`,
    [userCartId]
  );

  const cartItems = cartItemsResult.rows;

  for (const item of cartItems) {
    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ($1, $2, $3, $4)`,
      [orderId, item.product_id, item.quantity, item.price]
    );
  }

  await db.query(`DELETE FROM cart_items WHERE cart_id = $1`, [userCartId]);

  return orderResult.rows[0];
};

