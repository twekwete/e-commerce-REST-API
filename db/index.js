import { Pool } from 'pg'
 
const pool = new Pool({
  user: 'postgres',
  password: '252771',
  host: 'localhost',
  port: 5432,
  database: 'ecommerce_db',
})
 
export const query = (text, params) => {
  return pool.query(text, params)
}