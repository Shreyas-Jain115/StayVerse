import React, { useContext, useEffect } from "react";
import FormLayout from "../Home/FormLayout";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { userDao } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDao) {
      navigate('/customers');
    }
  }, [userDao, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <FormLayout />
    </div>
  );
};

export default LoginPage;
