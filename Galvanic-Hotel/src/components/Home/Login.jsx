import React, { useState, useContext } from "react";
import { login } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ManagerContext } from "../../context/ManagerContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setManagerDao } = useContext(ManagerContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      setManagerDao(response.data);
      toast.success("Login successful!");
      navigate("/customers");
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Login
        </h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
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
