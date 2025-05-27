// App.js or MainContent.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/footer";
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";
import Details from "./components/Details/Details";
import EditRoomDetails from "./components/Details/EditRoomDetails";
import QRCodePage from "./components/QRCode/QRCodePage";
import Register from "./components/Home/Register";
import Login from "./components/Home/Login";
import { ManagerContext } from "./context/ManagerContext";

const PrivateRoute = ({ children }) => {
  const { managerDao } = useContext(ManagerContext);
  return managerDao ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { managerDao } = useContext(ManagerContext);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/qr-code" element={<QRCodePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <Details />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-room/:roomId"
              element={
                <PrivateRoute>
                  <EditRoomDetails rooms={managerDao?.roomDaoList || []} />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
