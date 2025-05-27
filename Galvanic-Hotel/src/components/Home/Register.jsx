import React, { useState } from "react";
import { registerHotel } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    Hname: "",
    location: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerHotel(form);
      toast.success("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Register
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="Hname"
          placeholder="Hotel Name"
          value={form.Hname}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="location"
          placeholder="Hotel Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Hotel Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-2 text-blue-600 hover:underline bg-transparent"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default Register;
