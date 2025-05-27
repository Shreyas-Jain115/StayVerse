import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDao, setUserDao] = useState(null);
  const [verified, setVerified] = useState(false);
  // Auto-login/session persistence
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setUserDao(JSON.parse(token));
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const refershUserDao = async () => {
    if (!userDao) return;
    const response = await axios.post(
      `${API_BASE_URL}/login`,
      null,
      { params: {
        email: userDao.user.email,
        password: userDao.user.password
      } }
    );
    localStorage.setItem('token', JSON.stringify(response.data));
    setUserDao(response.data);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUserDao(null);
  };

  return (
    <UserContext.Provider value={{ userDao, setUserDao, refershUserDao, logout,setVerified,verified }}>
      {children}
    </UserContext.Provider>
  );
};
