// App.js or MainContent.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, UserContext } from "./context/UserContext";
import { useContext } from "react";
import Navbar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/footer";
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";
import Details from "./components/Details/Details";
import Hotels from "./components/Details/Hotels";
import HotelDetails from "./components/Details/HotelDetails"; 
import Booking from "./components/Details/Booking";
import LoginPage from "./components/Auth/LoginPage";
import UploadImage from "./components/Auth/UploadImage";
import VerifyFace from "./components/Auth/VerifyFace";
const ProtectedRoute = ({ children }) => {
  const { userDao } = useContext(UserContext);
  if (!userDao) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <Details />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotel"
                element={
                  <ProtectedRoute>
                    <Hotels />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotel/:id"
                element={
                  <ProtectedRoute>
                    <HotelDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-image"
                element={<UploadImage />}
              />
              <Route
                path="/verify-face"
                element={<VerifyFace />}
                />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
