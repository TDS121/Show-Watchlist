// From lab 9 - Login.jsx: state for what's typed,
// an error message, and props.onLogin to tell App who logged in
import { useState } from "react";
import Input from "./Input.jsx";

// The login form. "Login" checks an existing account,
// "Create account" saves a new one. Both log you in if they work.
function Login(props) {
  // what's typed in the boxes
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // an error message, or "" when there's no error
  const [error, setError] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  // Sends the username and password to the back end.
  // route is "login" or "register".
  // From lab 3 - fetch with await, and try/catch for when the server can't be reached
  async function send(route) {
    if (username === "" || password === "") {
      setError("Please type a username and a password.");
      return;
    }
    try {
      const response = await fetch("/api/auth/" + route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });
      const data = await response.json();
      if (!response.ok) {
        // The back end says what went wrong, like "That username is taken."
        setError(data.error);
        return;
      }
      console.log("Logged in as", data.username);
      setError("");
      props.onLogin(data.username);
    } catch (err) {
      console.log("something went wrong:", err);
      setError("Couldn't reach the server. Is the back end running?");
    }
  }

  // Pressing Enter or clicking Login. preventDefault stops the page reloading (lab 3).
  function handleSubmit(event) {
    event.preventDefault();
    send("login");
  }

  function handleCreateAccount() {
    send("register");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Username"
        autoComplete="username"
        value={username}
        onChange={handleUsernameChange}
      />
      <Input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button type="submit">Login</button>
      <button type="button" className="secondary" onClick={handleCreateAccount}>
        Create account
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default Login;
