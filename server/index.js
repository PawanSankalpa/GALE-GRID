// ======================== Imports ========================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import pgSession from "connect-pg-simple";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import db, { connectDB } from "./db.js";

// ======================== Config ========================
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const PgSession = pgSession(session);
const saltRounds = 12;

// ======================== Middleware ========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://www.galegrid.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(
  session({
    store: new PgSession({
      pool: db,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ======================== Passport Strategies ========================

// Local strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const normalizedEmail = email.toLowerCase();
      const result = await db.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);

      if (result.rows.length === 0) return done(null, false);

      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? done(null, user) : done(null, false);
    } catch (err) {
      console.error("Local strategy error:", err);
      return done(err);
    }
  })
);

// Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://gale-grid-1.onrender.com/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.email.toLowerCase();
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        const firstName = profile.given_name || profile.displayName.split(" ")[0];
        const lastName = profile.family_name || profile.displayName.split(" ")[1] || "";
        const username = profile.displayName.replace(/\s+/g, "").toLowerCase();

        const newUser = await db.query(
          "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [firstName, lastName, username, email, null]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        console.error("Google strategy error:", err);
        return done(err, false);
      }
    }
  )
);

// ======================== Passport Serialization ========================
passport.serializeUser((user, done) => {
  if (!user || !user.user_id) {
    console.error("serializeUser: Invalid user object", user);
    return done(new Error("User ID is missing for session serialization"));
  }
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (result.rows.length === 0) return done(new Error("User not found"));
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// ======================== Routes ========================

// Register user
app.post("/register/user", async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)",
      [first_name, last_name, username, normalizedEmail, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login user
app.post("/login/user", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

// Logout
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// Get current user
app.get("/api/current_user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// Google OAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/", // Update to frontend dashboard if needed
  })
);

// ======================== Server Start ========================
async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1);
  }
}

startServer();
