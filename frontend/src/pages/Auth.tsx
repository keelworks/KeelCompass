import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { register, login } from "../utils/store";
import Snackbar from "../components/ui/Snackbar";

const Auth = () => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (isSignup && !formData.username) return "Username is required";
    if (!formData.email.includes("@")) return "Invalid email format";
    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      return "Password must be 8+ chars, 1 number, 1 uppercase";
    }
    return "";
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 4000);
      return;
    }

    try {
      if (isSignup) {
        const token = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", token);
        localStorage.setItem("lastActive", new Date().getTime().toString());
        try {
          const decoded = jwtDecode<{ id: number; username: string }>(token);
          if (decoded && typeof decoded.id !== 'undefined') {
            localStorage.setItem("userId", decoded.id.toString());
          } else {
            localStorage.removeItem("userId");
          }
          localStorage.setItem("username", decoded.username);
        } catch (e) {
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
        }
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 4000);
        navigate("/");
        return;
      } else {
        const token = await login({
          email: formData.email,
          password: formData.password,
        });
        if (!token) throw new Error("Invalid response from server");
        localStorage.setItem("token", token);
        localStorage.setItem("lastActive", new Date().getTime().toString());
        try {
          const decoded = jwtDecode<{ id: number; username: string }>(token);
          if (decoded && typeof decoded.id !== 'undefined') {
            localStorage.setItem("userId", decoded.id.toString());
          } else {
            localStorage.removeItem("userId");
          }
          localStorage.setItem("username", decoded.username);
        } catch (e) {
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
        }
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid Email or Password. Please try again.");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 4000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          {isSignup ? "Already have an account?" : "Don't have an account?"} {" "}
          <button className="text-blue-500 underline" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

        {!isSignup && (
          <p className="text-center mt-2">
            <a href="/reset-password" className="text-blue-500">Forgot Password?</a>
          </p>
        )}
      </div>
      
      {showSnackbar && error && (
        <Snackbar message={error} onClose={() => setShowSnackbar(false)} />
      )}
    </div>
  );
};

export default Auth;
