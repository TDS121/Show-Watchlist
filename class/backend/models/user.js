// lab 6 - fruitsProject (a schema, then a model)
// and 333FullToDo models/todos.js (export the model, timestamps)
import mongoose from "mongoose";

// One account. The password itself is never saved, only its bcrypt hash.
// Used Claude for the hashing and consistencies below
const userSchema = new mongoose.Schema(
  {
    // unique: MongoDB won't let two accounts have the same username
    // lowercase: "Tristan" and "tristan" are the same account
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select: false leaves the hash out of every search unless a route asks for it
    password_hash: { type: String, required: true, select: false },
  },
  {
    // Saves created_at as a date, like createdAt in the todo app
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// "users" is the collection name
export const User = mongoose.model("User", userSchema, "users");
