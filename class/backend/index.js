// From 333FullToDo cs333-api-main/index.js - constants from .env, middleware, database, routes
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import session from "express-session";

import authRoutes from "./routes/auth.js";

// Constants (npm run dev and npm start read these from your .env file)
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "production";
const DB_CONNECT = process.env.DB_CONNECT || "mongodb://localhost:27017/watchlist";
const SESSION_SECRET = process.env.SESSION_SECRET;

// The secret signs the login cookie, so don't start without one
// Got Claude to do the cookies since it is better practice to hahve them and secu// Got Claude to add this check: the secret signs the login cookie, so don't start without onerity
if (!SESSION_SECRET) {
  console.error("SESSION_SECRET is missing from .env. See .env.example.");
  process.exit(1);
}

// Initialize Express
const app = express();

// On the server, nginx sits in front of Express (lab 6). This lets Express
// see the visitor's real address and that the connection was HTTPS.
if (ENV === "production") {
  app.set("trust proxy", 1);
}

// adapted from lab 4 - morgan logs every request in the terminal
app.use(morgan("dev"));
// Turns a JSON body into req.body (the todo app does the same)
app.use(express.json());

// Got claude to add that express-session remembers who is l// Got Claude to add express-session (remembers who is logged in) and the cookie settings.ogged in and the cookie config.
// The browser gets a cookie with a random id; the server keeps the rest.
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // no cookie until someone logs in
    cookie: {
      httpOnly: true, // page JavaScript can't read it, so it can't be stolen that way
      secure: ENV === "production", // HTTPS only on the server (localhost is plain http)
      sameSite: "lax", // not sent along with forms posted from other sites
      maxAge: 7 * 24 * 60 * 60 * 1000, // stay logged in for a week
    },
  })
);

// Treat {"$ne": null} style objects in a search as plain values, not
// database commands (the MongoDB version of "no string-built SQL")
mongoose.set("sanitizeFilter", true);

// From lab 6 - fruitsProject (await mongoose.connect)
await mongoose.connect(DB_CONNECT);
console.log("MongoDB connected");

// Routes. The browser calls /api/auth/...; Vite (laptop) or nginx (server) takes the /api off.
app.use("/auth", authRoutes);

// From lab 5 - start the server and say where it's listening
app.listen(PORT, function () {
  console.log("Listening on http://localhost:" + PORT + " (" + ENV + ")");
});
