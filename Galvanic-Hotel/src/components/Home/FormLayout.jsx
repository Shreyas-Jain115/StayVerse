import React, { useState, useContext } from "react";
import { login } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ManagerContext } from "../../context/ManagerContext"; // Import ManagerContext

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setManagerDao } = useContext(ManagerContext); // Access setManagerDao from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData); // Call the login API
      localStorage.setItem("user", JSON.stringify(response.data)); // Store user data in localStorage
      setManagerDao(response.data); // Update context with ManagerDao object
      console.log(response.data); // Log the response data
      navigate("/customers"); // Navigate to the dashboard
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  return (
    <div className="bg-gray-100 m-2 p-6 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300 dark:bg-black dark:border-black-700 border-gray-900"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
