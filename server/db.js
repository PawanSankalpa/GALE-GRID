import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

const pool = new pg.Pool({
  user: process.env.PG_USER,         // e.g., "postgres"
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,     // e.g., "test_db"
  password: process.env.PG_PASSWORD, // e.g., "mypassword"
  port: process.env.PG_PORT,                   // default PostgreSQL port
});

// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl:
//    { rejectUnauthorized: false },
// });


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