// ──────────────────────────────────────────────────────
// 1. IMPORTS & CONFIGURATION
// ──────────────────────────────────────────────────────
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import db, { connectDB } from "./db.js";
import { isGoogleAuthConfigured } from "./utils/authConfig.js";

dotenv.config();

const app = express();
const port = 8000;
const saltRounds = 12;
const PgSession = pgSession(session);


// ──────────────────────────────────────────────────────
// 2. MIDDLEWARE
// ──────────────────────────────────────────────────────
app.set('trust proxy', 1); // if behind a proxy (e.g., Render or Vercel)

app.use(
  cors({
    origin: "http://localhost:3000/", //"https://www.galegrid.com"
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


// ──────────────────────────────────────────────────────
// 3. PASSPORT STRATEGIES
// ──────────────────────────────────────────────────────

// LOCAL STRATEGY
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, cb) => {
    const normalizedEmail = email.toLowerCase();
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
      if (result.rows.length === 0) return cb(null, false);

      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) return cb(null, user);
      else return cb(null, false);
    } catch (err) {
      return cb(err);
    }
  })
);

// GOOGLE STRATEGY
if (isGoogleAuthConfigured(process.env)) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/", //https://gale-grid-1.onrender.com/auth/google/callback
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.email.toLowerCase();
          const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

          if (result.rows.length > 0) return done(null, result.rows[0]);

          const firstName = profile.given_name || profile.displayName.split(' ')[0];
          const lastName = profile.family_name || profile.displayName.split(' ')[1] || '';
          const username = profile.displayName.replace(/\s+/g, '').toLowerCase();

          const newUser = await db.query(
            "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [firstName, lastName, username, email, null]
          );
          return done(null, newUser.rows[0]);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
} else {
  console.warn("Google OAuth is not configured. Skipping Google strategy registration.");
}


// ──────────────────────────────────────────────────────
// 4. SESSION HANDLERS
// ──────────────────────────────────────────────────────
passport.serializeUser((user, cb) => {
  if (!user?.user_id) return cb(new Error("Missing user ID"));
  cb(null, user.user_id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (result.rows.length > 0) cb(null, result.rows[0]);
    else cb(new Error("User not found"));
  } catch (err) {
    cb(err);
  }
});


// ──────────────────────────────────────────────────────
// 5. AUTH ROUTES
// ──────────────────────────────────────────────────────

// REGISTER
app.post("/register/user", async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
    if (userExists.rows.length > 0) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)",
      [first_name, last_name, username, normalizedEmail, hashedPassword]
    );
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("SignUp error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (LOCAL)
app.post("/login/user", (req, res, next) => {
  const username = req.body.username;

  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: "Invalid username or password!" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.session.user = { username };
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});


// ──────────────────────────────────────────────────────
// 6. GOOGLE OAUTH ROUTES
// ──────────────────────────────────────────────────────
if (isGoogleAuthConfigured(process.env)) {
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/login", //"https://www.galegrid.com/login
      successRedirect: "http://localhost:3000/", //https://www.galegrid.com/
    })
  );
}


// ──────────────────────────────────────────────────────
// 7. USER STATE ROUTES
// ──────────────────────────────────────────────────────

// Check if logged in
app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});



// ──────────────────────────────────────────────────────
// 8. START SERVER
// ──────────────────────────────────────────────────────
async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error);
    process.exit(1);
  }
}

startServer();
