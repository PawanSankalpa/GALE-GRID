import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db, { connectDB } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";


dotenv.config();

const app = express();
const port = 8000;

const saltRounds = 14

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json()); // to parse JSON bodies
app.use(cors({
  origin: "https://www.galegrid.com", // your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // if your frontend sends cookies or auth headers
}));


//sregister route
app.post("/api/register", async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;

    try {
        const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
            email
        ]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists!"});
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await db.query("INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)", [
            first_name, last_name, username, email, hashedPassword
        ]);

        res.status(201).json({ message: "User created successfully!" });

    } catch (error) {
        console.log("signUp error:", error); 
        res.status(500).json({ message: "Server error "});
    }

});


//logIn route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
            email
        ]);

        if (userResult.rows.length === 0){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = userResult.rows[0];
        
        // compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });    
        }

        // if password works

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } 
        );

        res.status(200).json({ message: "Login successfull!",
            token,
            user: { 
                id: user.id, 
                username: user.username,
                email: user.email,
            } 
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }

});
// // just for testing
// app.get("/", (req, res) => {
//     res.send("API is running");
// });

// app.get("/test-users", async (req, res) => {
//     try {
//         const result = await db.query(
//             "INSERT INTO contacts (name, email, phone, message) VALUES ($1, $2, $3, $4)", [
//                 'John Doe', 'john@example.com', '1234567890', 'Hello there!'
//             ]);

//         res.json(result.rows[0]);
//     } catch (error) {
//         console.error("DB error :", error);
//         res.status(500).send("Error inserting data");
//     }
// });

async function startServer() {
  try {
    await connectDB();  // wait for DB to connect
    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1); // stop the app if DB connection fails
  }
}

startServer();

