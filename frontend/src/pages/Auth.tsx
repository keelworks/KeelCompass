import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Snackbar from "../components/ui/Snackbar"; 

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (isSignup && !formData.name) return "Name is required";
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
      const response = await fetch(`http://localhost:8080/api/auth/${isSignup ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup
            ? { username: formData.name, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password }
        ),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Something went wrong");
      }
  
      const data = response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : {};
  
      if (!data.token) throw new Error("Invalid response from server");

  
      localStorage.setItem("token", data.token);
      localStorage.setItem("lastActive", new Date().getTime().toString());
  
      const decoded = jwtDecode<{ id: number; username: string }>(data.token);
      localStorage.setItem("userId", decoded.id.toString());
      localStorage.setItem("username", decoded.username);
      console.log("Decoded JWT:", decoded);
  
      navigate("/dashboard");
      console.log(data);
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
        {showSnackbar && error && (
  <Snackbar message={error} onClose={() => setShowSnackbar(false)} />
)}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
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
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>


        {!isSignup && (
          <p className="text-center mt-2">
            <a href="/reset-password" className="text-blue-500">Forgot Password?</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
