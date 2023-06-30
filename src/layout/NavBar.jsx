import { Link } from 'react-router-dom';
import './NavBar.css'; 
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("User logged out");
      })
      .catch((error) => {
        // An error happened.
        console.error("Error logging out: ", error);
      });
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/travelplans">Travel Plans</Link>
        <Link to="/Account">Account</Link>
      </div>

      <button onClick={handleLogout} className="account-button">
      <Link to="/login">Logout</Link>
      </button>
    </nav>
  );
};

export default Navbar;
