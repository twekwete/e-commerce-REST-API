import isEmail from "validator/lib/isEmail.js";
import { passwordHash } from "../utils/password.js";
import * as db from "../db/index.js";

export const registerUser = async (user) => {
  const { name, surname, email, address, password } = user;
  if (!(name && surname && email && address && password)) {
    throw new Error("Invalid fields provided ");
  }

  const isValidEmail = isEmail(email);

  if (!isValidEmail) {
    throw new Error("Invalid Email provided");
  }

  const emailCheck = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (emailCheck.rows[0]) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await passwordHash(password);

  const result = await db.query(
    `INSERT INTO users (name, surname, email, address, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, surname, email, address;`,
    [name, surname, email, address, hashedPassword]
  );

  return result.rows[0];
};
