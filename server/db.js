import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
   { rejectUnauthorized: false },
});


async function connectDB() {
    try {
        await pool.connect();
        console.log("Connected to the database!");
    } catch (error) {
        console.error("Database connection error: ", error)
    }
}

export default {
    query: (text, params) => pool.query(text, params),
};
export { connectDB };