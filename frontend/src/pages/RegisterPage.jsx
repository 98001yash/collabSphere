import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { registerUser } from "../api"; // <-- import API function

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [bio, setBio] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      name,
      email,
      password,
      role,
      bio,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      const res = await registerUser(userData);

      // backend sends response in res.data.data
      const registeredUser = res.data.data;
      const mockToken = "jwt-token-placeholder"; // replace if backend gives token

      login(registeredUser, mockToken);

      navigate(registeredUser.role === "FACULTY" ? "/faculty" : "/student");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">Join CollabSphere 🚀</h1>
        <p className="text-lg text-center max-w-md">
          Create your account today and start showcasing projects, earning
          endorsements, and collaborating with peers and mentors.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-100"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Register
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
          </select>

          <textarea
            placeholder="Short Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />

          <div className="flex gap-3">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-1/2 p-3 border mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-1/2 p-3 border mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-semibold hover:opacity-90 transform hover:scale-105 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
