import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    company: "", 
    position: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register(form);
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            type="text" 
            name="company" 
            placeholder="Company Name" 
            value={form.company} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            type="text" 
            name="position" 
            placeholder="Position" 
            value={form.position} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <a href="/login" className="link">Already have an account? Login</a>
      </div>
    </div>
  );
};

export default Signup;
