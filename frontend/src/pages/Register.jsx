import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Button from "../components/Button";
import Input from "../components/Input";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { notify } = useNotification();

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      notify(passwordError, "warning");
      return;
    }

    try {
      await registerUser(name, email, password);
      const data = await loginUser(email, password);
      login(data);
      notify("Account created successfully. Welcome!", "success");
      navigate("/dashboard");
    } catch (error) {
      notify(error.response?.data?.message || error.message || "Registration failed", "error");
    }
  };

  return (

    <div className="login-page">
      <div className="login-card">

        <h2 className="login-title">
          Create your account
        </h2>

        <p className="login-subtitle">
          Access my private relationship coaching space
        </p>

        <form className="login-form" onSubmit={handleSubmit}>

          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Create account
          </Button>

        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;