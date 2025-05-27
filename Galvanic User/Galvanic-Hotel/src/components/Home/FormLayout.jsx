import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext'; // Assuming context is defined here
import { API_BASE_URL } from '../../api'; // Assuming API_BASE_URL is defined here
function FormLayout() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { setUserDao } = useContext(UserContext); // Corrected property name

  // Removed useEffect for redirect

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post(
          `${API_BASE_URL}/login`,
          null,
          { params: formData }
        );
        // Store credentials for session refresh
        const userWithCreds = {
          ...response.data,
          user: {
            ...response.data.user,
            email: formData.email,
            password: formData.password
          }
        };
        localStorage.setItem('token', JSON.stringify(userWithCreds));
        setUserDao(userWithCreds); // Corrected property name
        console.log('Login successful:', response.data);
        alert('Login successful!');
        navigate('/customers');
      } else {
        await axios.post(`${API_BASE_URL}/register`, formData);
        alert('Registration successful!');
      }
    } catch (error) {
      alert(isLogin ? 'Error logging in' + error: 'Error registering user');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg dark:bg-gray-800">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              isLogin
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`ml-4 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              !isLogin
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          {!isLogin && (
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-300 focus:outline-none transition-all duration-300"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormLayout;
