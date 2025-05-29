// ======================== Imports ========================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import pgSession from "connect-pg-simple";
import bcrypt from "bcrypt";
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

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      "https://www.galegrid.com",
      "https://galegrid.com",
      "http://localhost:3000" // for development
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Session configuration with enhanced settings
app.use(
  session({
    store: new PgSession({
      pool: db,
      tableName: "session",
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? ".galegrid.com" : undefined
    }
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Debugging middleware
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Authenticated:', req.isAuthenticated());
  next();
});

// ======================== Passport Strategies ========================

// Local strategy with enhanced error handling
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const normalizedEmail = email.toLowerCase();
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          normalizedEmail,
        ]);

        if (result.rows.length === 0) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        const user = result.rows[0];
        
        // Handle social login users who don't have passwords
        if (!user.password) {
          return done(null, false, { 
            message: "This account was created with social login. Please use that method to sign in." 
          });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, user);
      } catch (err) {
        console.error("Local strategy error:", err);
        return done(err);
      }
    }
  )
);

// Google strategy with enhanced profile handling
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://gale-grid-1.onrender.com/auth/google/callback",
      passReqToCallback: true,
      proxy: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.email.toLowerCase();
        const existingUser = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        const firstName = profile.given_name || 
                         profile.displayName?.split(" ")[0] || 
                         "User";
        const lastName = profile.family_name || 
                        profile.displayName?.split(" ")[1] || 
                        "";
        const username = profile.displayName?.replace(/\s+/g, "").toLowerCase() || 
                         `user${Math.floor(Math.random() * 10000)}`;

        const newUser = await db.query(
          `INSERT INTO users 
           (first_name, last_name, username, email, password, provider) 
           VALUES ($1, $2, $3, $4, $5, $6) 
           RETURNING *`,
          [firstName, lastName, username, email, null, "google"]
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
  if (!user?.user_id) {
    console.error("Invalid user object during serialization:", user);
    return done(new Error("User ID is missing"));
  }
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query(
      "SELECT user_id, first_name, last_name, email, username FROM users WHERE user_id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return done(new Error("User not found"));
    }
    
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// ======================== Routes ========================

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Register user with validation
app.post("/register/user", async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    // Check if user exists
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [normalizedEmail, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      `INSERT INTO users 
       (first_name, last_name, username, email, password) 
       VALUES ($1, $2, $3, $4, $5)`,
      [first_name, last_name, username, normalizedEmail, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login with proper error responses
app.post("/login/user", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ 
        message: info?.message || "Authentication failed" 
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Return only necessary user data
      const { user_id, first_name, last_name, email, username } = user;
      return res.status(200).json({
        message: "Login successful",
        user: { user_id, first_name, last_name, email, username }
      });
    });
  })(req, res, next);
});

// Enhanced logout
app.post("/logout", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "No user to logout" });
  }

  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Session cleanup failed" });
      }

      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

// Current user endpoint with protection
app.get("/api/current_user", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ user: null });
  }

  // Return minimal user data
  const { user_id, first_name, last_name, email, username } = req.user;
  res.json({ 
    user: { user_id, first_name, last_name, email, username } 
  });
});

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { 
    scope: ["email", "profile"],
    prompt: "select_account" 
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://www.galegrid.com/login?error=google",
    session: true,
  }),
  (req, res) => {
    // Successful authentication
    res.redirect("https://www.galegrid.com/redirect");
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ======================== Server Start ========================
async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();