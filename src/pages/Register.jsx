import React from "react";
import { Button, Form } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/css/Login.css";
import logo from "../assets/wanderwiselogo-crop.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from '../config/Firebase'; // Add this line

function RegisterForm() {

  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Retrieve form input values
    const username = event.target.elements.username.value;
    const firstname = event.target.elements.firstname.value;
    const lastname = event.target.elements.lastname.value;
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", user.uid);
      const userData = {
        username,
        firstname,
        lastname,
        email,
      };
      await setDoc(userDocRef, userData);

      // Redirect the user to a different page or perform other actions
      navigate("/login");

    } catch (error) {
      // Handle error during user creation or data storage
      const errorCode = error.code;
      const errorMessage = error.message;
    
      // Log the error
      console.log('Error Code: ', errorCode);
      console.log('Error Message: ', errorMessage);
    }
  };

  return (
    <div className="form-container">
      <img src={logo} alt="Logo" className="logo react" />
      <h2 className="form-title">Sign Up</h2>
      <p>
        Already have an account?
          <Link to="/login">Log in</Link>
      </p>
      <Form onSubmit={handleFormSubmit}>
      <Form.Field className="form-field">
          <label className="form-label">Username</label>
          <input className="form-input" placeholder="jdoe" name="username" />
        </Form.Field>
        <Form.Field className="form-field">
          <label className="form-label">First Name</label>
          <input className="form-input" placeholder="John" name="firstname" />
        </Form.Field>
        <Form.Field className="form-field">
          <label className="form-label">Last Name</label>
          <input className="form-input" placeholder="Doe" name="lastname" />
        </Form.Field>
        <Form.Field className="form-field">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="johndoe2@gmail.com" name="email" />
        </Form.Field>
        <Form.Field className="form-field">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            name="password"
          />
        </Form.Field>

        <div className="form-submit">
          <Button color="purple" type="submit">
            Register
          </Button>
        </div>
      </Form>
      <br></br>

    </div>
  );
}

export default RegisterForm;
