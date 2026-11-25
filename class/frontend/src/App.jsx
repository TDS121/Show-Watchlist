// adapted from lab 9 - App.jsx (steps 12 and 15): isLoggedIn and username
// state, and a ternary that shows Hello or the Login form
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login.jsx";

// The whole page: the login form when nobody is logged in, Hello when someone is.
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // When the page loads, ask the back end if this browser is already logged
  // in (the cookie goes along by itself), so a reload doesn't log you out.
  // From 333FullToDo Todos.jsx - fetch once in useEffect
  useEffect(function () {
    async function checkLogin() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("couldn't check the login:", err);
      }
    }
    checkLogin();
  }, []);

  // Login tells us the name once the back end says the password is right
  function handleLogin(name) {
    setUsername(name);
    setIsLoggedIn(true);
  }

  // Tell the back end to forget this login, then show the form again
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.log("couldn't log out:", err);
    }
    setIsLoggedIn(false);
    setUsername("");
  }

  return (
    <div className="App">
      <h1>🎬 Watchlist</h1>
      {isLoggedIn ? (
        <div>
          <h2>Hello, {username}!</h2>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
