import { React, useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/css/Login.css"; // Import the CSS file
import logo from "../assets/wanderwiselogo-crop.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Firebase"; // Add this line
import UserContext from "../context/UserContext";

const Login = () => {
  const [error, setError] = useState(false); // Add this line
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        // ...
        console.log("Successfully Logged In!");
        alert("Successfully Logged In!");
        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // You can add a switch statement here to handle different error types
        switch (errorCode) {
          case "auth/user-not-found":
            console.log("User is not registered.");
            alert("User is not registered.");
            break;
          case "auth/wrong-password":
            setError("Incorrect email or password.");
            break;
          default:
            setError(errorMessage); // Display the firebase default error message
        }
      });
  };

  return (
    <div className="form-container">
      <a href="/" target="_blank">
        <img src={logo} alt="Logo" className="logo react" />
      </a>
      <h2 className="form-title">Log In to your account</h2>
      <p className="form-subtitle">
        Create your account <Link to="/register">Sign Up here</Link>
      </p>
      <Form onSubmit={handleLogin}>
        <Form.Field className="form-field">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="johndoe2@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Field>
        <Form.Field className="form-field">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Field>
        <div className="form-submit">
          <Button color="purple" type="submit">
            Login
          </Button>
          {error && <span>Invalid Credentials!</span>}
        </div>
      </Form>
    </div>
  );
};

export default Login;
