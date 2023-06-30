import React, { useContext } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import MyForm from "../pages/Login";
import RegisterForm from "../pages/Register";
import Home from "../pages/Home";
import TravelPlan from "../pages/TravelPlan";
import Account from "../pages/Account";
import CreateTrip from "../pages/Create";
import EditUser from "../pages/EditUser";
import Navbar from '../layout/NavBar';
import { AuthContext } from '../context/AuthContext';


function MainRoute() {
  const location = useLocation();
  const hideOnRoutes = ['/', '/login', '/register'];

  const {currentUser} = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  console.log(currentUser);

  return (
    <>
      {!hideOnRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<MyForm />} />
        <Route path="/login" element={<MyForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/travelplans" element={<TravelPlan />} />
        <Route path="/account" element={<Account />} />
        <Route path="/createtrip" element={<CreateTrip />} />
        <Route path="/edituser" element={<EditUser />} />
      </Routes>

    </>
  );
}

export default MainRoute;
