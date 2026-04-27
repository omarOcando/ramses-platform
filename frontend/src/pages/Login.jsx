import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useNotification } from "../context/NotificationContext";
import Button from "../components/Button";
import Input from "../components/Input";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { notify } = useNotification();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      login(data);

      navigate("/dashboard");
    } catch (error) {
      notify("Login failed. Check your email and password.", "error");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h2 className="login-title">
          Welcome
        </h2>

        <p className="login-subtitle">
          Access your private dashboard
        </p>

        <form className="login-form" onSubmit={handleSubmit}>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            variant="primary"
            type="submit"
          >
            Sign in
          </Button>

        </form>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;