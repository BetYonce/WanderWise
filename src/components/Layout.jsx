import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import MainRoute from '../routes/MainRoutes';
import Navbar from '../layout/NavBar'; // Assuming your Navbar component is in the layout folder

// This is a new component being defined within the same file
function Layout() {
  const location = useLocation();
  const hideOnRoutes = ['/login', '/register'];

  return (
    <>
      {!hideOnRoutes.includes(location.pathname) && <Navbar />}
      <MainRoute />
    </>
  );
}

export default Layout;