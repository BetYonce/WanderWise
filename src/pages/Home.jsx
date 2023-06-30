import React from "react";
import "../pages/css/Home.css";
import { Container} from "semantic-ui-react";
import { Link } from "react-router-dom";
import beijing from "../assets/beijing.png";

const Home = () => {
  return (
    <>
      <Container>
        <div className="home-title">
          <h1>Wisely Plan Your Wanderlust</h1>
          <img src={beijing} alt="beijing" className="beijing-img" />
        </div>
        <div className="home-sub">
          <h2>We Plan it all for You!</h2>
        </div>
        <Link to="/createtrip">
          <button className="create-trip" type="submit">
            Create Trip
          </button>
        </Link>
      </Container>
    </>
  );
};

export default Home;
