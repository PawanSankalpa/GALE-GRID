import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db, { connectDB } from "./db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import session from "express-session";
import pgSession from "connect-pg-simple";

dotenv.config();

const app = express();
const port = 8000;

const PgSession = pgSession(session);

const saltRounds = 12;

app.use(
  cors({
    origin: "https://www.galegrid.com/", // your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if your frontend sends cookies or auth headers
  })
);

app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: true })); 


app.use(
  session({
    store: new PgSession({
      pool: db, // your existing PostgreSQL pool
      tableName: "session", // name of table to store sessions
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 , // 7 days
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());




//register route
app.post("/register/user", async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      normalizedEmail,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)",
      [first_name, last_name, username, normalizedEmail, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.log("signUp error:", error);
    res.status(500).json({ message: "Server error " });
  }
});

/* ----------------------------login------------------------- */
app.post("/login/user", (req, res, next) => {
  const username = req.body.username;

  passport.authenticate("local", (err, user, info) => {
    
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: "Invalid username or password!" });

    
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.session.user = { username } ; // save to session
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

/* --------------------------check if the useris logged in----------------*/
app.get("/user", ( req, res ) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });

  } else {
    res.json({ loggedIn: false });

  }
});


//------------------------------------------------------------------------
// Redirect user to Google for authentication
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Google OAuth callback URL
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // redirect if failed
    successRedirect: '/',      // redirect if success
  })
);




/* ------------------------------Local strategy--------------------------- */
/** ----------- Passport strategy section ------------ */
//Local passport strategy
passport.use(
  new Strategy(
    { usernameField: "email" },
    async function verify(email, password, cb) {
      const normalizedEmail = email.toLowerCase();
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        normalizedEmail,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        return cb(null, false);
      }
    } catch (err) {
      console.log(err);
    }
  })
);
//-----------------------------------------------------------------------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://gale-grid-1.onrender.com/auth/google/callback",
  passReqToCallback: true,
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    // Check if user with Google email already exists
    const email = profile.email.toLowerCase();

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      // User exists, return user object
      return done(null, result.rows[0]);
    } else {
      // User does NOT exist, create new user
      const firstName = profile.given_name || profile.displayName.split(' ')[0];
      const lastName = profile.family_name || profile.displayName.split(' ')[1] || '';
      const username = profile.displayName.replace(/\s+/g, '').toLowerCase();

      // Insert user to DB (you might want to generate a random password or leave null)
      const insertResult = await db.query(
        "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [firstName, lastName, username, email, null]
      );

      return done(null, insertResult.rows[0]);
    }
  } catch (err) {
    return done(err, false);
  }
}));



/* ------------------------------serialization--------------------------- */

passport.serializeUser((user, cb) => {
  if (!user || !user.user_id) {
    console.error("serializeUser: Invalid user object", user);
    return cb(new Error("User id is missing for session serialization"));
  }
  cb(null, user.user_id); // <-- use user.user_id, not user.id
});



passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (result.rows.length > 0) {
      cb(null, result.rows[0]);
    } else {
      cb(new Error("User not found"));
    }
  } catch (err) {
    cb(err);
  }
});


/* --------------------------------------------------------- */
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid"); // clear session cookie
    res.json({ message: "Logged out successfully" });
  });
});


app.get("/api/current_user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user }); // req.user was set by Passport
  } else {
    res.json({ user: null });
  }
});




async function startServer() {
  try {
    await connectDB(); // wait for DB to connect
    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1); // stop the app if DB connection fails
  }
}

startServer();
