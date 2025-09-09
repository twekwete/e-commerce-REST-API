import { Pool } from 'pg'
import 'dotenv/config';
 
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
});
 
export const query = (text, params) => {
  return pool.query(text, params)
} 