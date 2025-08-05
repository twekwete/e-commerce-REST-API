import express from "express";
import * as db from "./db/index.js";
const app = express();
const PORT = 4500;

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM users");
  console.log(result)
  res.send(result.rows[0]);
});

app.listen(PORT, () => {
  console.log("listening at PORT: ", PORT);
});
