// Got Claude to do pretty much most of this file for the security parts
// From 333FullToDo routes/routes.js - an express.Router with async routes
import express from "express";
import bcrypt from "bcryptjs";

import { User } from "../models/user.js";

const router = express.Router();

// New (no lab covers it): bcryptjs turns a password into a hash that can't be
// turned back. To check a password later, bcrypt hashes the guess and compares.
// 12 is how much work each hash takes: quick for one login, slow for an attacker
// trying millions of guesses.
const BCRYPT_ROUNDS = 12;

// Login rate limit (new: no lab covers it). Counts wrong passwords per IP
// address. After 5 wrong tries, that address has to wait 15 minutes.
// It's kept in memory, so it resets when the server restarts.
const MAX_TRIES = 5;
const WAIT_MS = 15 * 60 * 1000;
const failedLogins = {}; // ip -> { count, since }

// True if this IP address has had too many wrong passwords lately
function tooManyTries(ip) {
  const entry = failedLogins[ip];
  if (!entry) {
    return false;
  }
  if (Date.now() - entry.since > WAIT_MS) {
    delete failedLogins[ip]; // the 15 minutes are up, start over
    return false;
  }
  return entry.count >= MAX_TRIES;
}

// Adds one wrong password to this IP address's count
function countFailedLogin(ip) {
  if (!failedLogins[ip]) {
    failedLogins[ip] = { count: 0, since: Date.now() };
  }
  failedLogins[ip].count += 1;
}

// Reads the username and password out of the JSON body.
// Anything that isn't text becomes "", so nobody can sneak a database
// command like {"$ne": null} in where the username should be.
function readForm(body) {
  const username = typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  return { username, password };
}

// Logs this user in on this browser. regenerate() swaps in a brand-new
// session id first, so an id someone planted before login is useless after it.
function startSession(req, res, next, user, status) {
  req.session.regenerate(function (err) {
    if (err) {
      return next(err);
    }
    req.session.userId = user._id.toString();
    res.status(status).json({ username: user.username });
  });
}

// POST /auth/register - make a new account and log straight in
router.post("/register", async function (req, res, next) {
  const { username, password } = readForm(req.body);

  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    return res.status(400).json({ error: "Username: 3 to 30 letters, numbers or _." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password needs at least 8 characters." });
  }
  // bcrypt only looks at the first 72 bytes, so refuse longer passwords
  // instead of quietly ignoring the end of them
  if (bcrypt.truncates(password)) {
    return res.status(400).json({ error: "Password is too long." });
  }

  const existing = await User.findOne({ username: username });
  if (existing) {
    return res.status(409).json({ error: "That username is taken." });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await User.create({ username: username, password_hash: passwordHash });
  console.log("New account:", user.username);
  startSession(req, res, next, user, 201);
});

// POST /auth/login - check the password against the saved hash
router.post("/login", async function (req, res, next) {
  if (tooManyTries(req.ip)) {
    return res.status(429).json({ error: "Too many wrong passwords. Try again in 15 minutes." });
  }

  const { username, password } = readForm(req.body);
  // password_hash has select: false, so ask for it here
  const user = await User.findOne({ username: username }).select("+password_hash");
  const passwordOk = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!passwordOk) {
    countFailedLogin(req.ip);
    // Same message for a wrong username and a wrong password,
    // so nobody can use this form to find out which usernames exist
    return res.status(401).json({ error: "Wrong username or password." });
  }

  delete failedLogins[req.ip];
  startSession(req, res, next, user, 200);
});

// GET /auth/me - who is logged in on this browser?
// The page asks this when it loads, so a reload doesn't log you out.
router.get("/me", async function (req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json({ username: user.username });
});

// POST /auth/logout - forget this browser's session
router.post("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.sendStatus(204);
  });
});

export default router;
