import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

async function connectDB() {
  try {
    await pool.connect();
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Database connection error: ", error);
  }
}

export default {
  query: (text, params) => pool.query(text, params),
};
export { connectDB };
