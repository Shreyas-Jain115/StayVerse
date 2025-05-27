import React, { createContext, useState, useEffect } from "react";
import { login } from "../services/api";
export const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
  const [managerDao, setManagerDao] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setManagerDao(JSON.parse(stored));
  }, []);

  const refreshManagerDao = async () => {
    if (!managerDao?.user?.email || !managerDao?.user?.password) return;
    const response = await login({
      email: managerDao.user.email,
      password: managerDao.user.password,
    });
    localStorage.setItem("user", JSON.stringify(response.data));
    setManagerDao(response.data);
  };

  const logout = () => {
    setManagerDao(null);
    localStorage.removeItem("user");
  };

  return (
    <ManagerContext.Provider value={{ managerDao, setManagerDao, refreshManagerDao, logout }}>
      {children}
    </ManagerContext.Provider>
  );
};