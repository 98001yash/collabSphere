import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);

      // Pass both user object and token to AuthContext
      login(res.data.data.user, res.data.data.token);

      // Navigate based on role
      navigate(res.data.data.user.role === "FACULTY" ? "/faculty" : "/student");
    } catch (err) {
      console.error(err);
      alert("Login failed. Check your credentials and try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 to-blue-500 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
        <p className="text-lg text-center max-w-md">
          Login to <span className="font-semibold">CollabSphere</span> and continue your journey —
          showcase projects, get endorsements, and find collaborators!
        </p>
      </div>

      {/* Right Section (Form) */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-100"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded-lg font-semibold hover:opacity-90 transform hover:scale-105 transition duration-200"
          >
            Login
          </button>

          <p className="text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-600 hover:underline cursor-pointer font-medium"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
