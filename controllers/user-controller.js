import * as db from "../db/index.js";

export const findUserById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
