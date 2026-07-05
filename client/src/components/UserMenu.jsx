import { useState } from "react";
import { login, getToken, setToken } from "../api/client.js";
import { IconUser } from "./Icons.jsx";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("demo@bharatrail.in");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const signedIn = Boolean(user || getToken());

  async function onLogin(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      setUser(data.user);
      setOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  function onLogout() {
    setToken(null);
    setUser(null);
    setOpen(false);
  }

  return (
    <div className="user-menu">
      <button type="button" className="icon-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Account">
        <IconUser />
      </button>
      {open && (
        <div className="user-menu-panel card">
          {signedIn && user ? (
            <>
              <p className="user-menu-name">{user.name}</p>
              <p className="muted">{user.email}</p>
              <button type="button" className="secondary-action full-width" onClick={onLogout}>Sign out</button>
            </>
          ) : (
            <form onSubmit={onLogin} className="user-menu-form">
              <label>
                Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </label>
              <button type="submit" className="primary-action full-width">Sign in</button>
              {error && <p className="form-error">{error}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
