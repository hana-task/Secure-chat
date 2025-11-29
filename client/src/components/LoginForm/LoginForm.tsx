import { useState } from "react";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import "./LoginForm.scss";

export const LoginForm = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await authApi.login(username, password);
        login({
          token: res.token,
          userId: res.user.id,     
          username: res.user.username
        });
      } else {
        await authApi.register(username, password);
        const res = await authApi.login(username, password);
      
        login({
          token: res.token,
          userId: res.user.id,
          username: res.user.username
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <div className="login-card card shadow-sm p-4">
        <h3 className="text-center mb-3">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading
              ? "Loading..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p
          className="text-center switch-mode mt-3"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Create new account" : "Back to login"}
        </p>
      </div>
    </div>
  );
};
