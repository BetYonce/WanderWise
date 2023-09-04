import React, { useState } from "react";
import "../pages/css/Create.css";
import beijing from "../assets/beijing.png";
import { Container, Dropdown } from "semantic-ui-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../config/Firebase";

const stateOptions = [
  { key: "sw", value: "Sarawak", text: "Sarawak" },
  { key: "sb", value: "Sabah", text: "Sabah" },
  { key: "tg", value: "Terengganu", text: "Terengganu" },
];

const districtOptions = {
  Sarawak: [
    { key: "kch", value: "Kuching", text: "Kuching" },
    { key: "myy", value: "Miri", text: "Miri" },
  ],
  Sabah: [
    { key: "kk", value: "Kota Kinabalu", text: "Kota Kinabalu" },
    { key: "tmb", value: "Tambunan", text: "Tambunan" },
  ],
  Terengganu: [
    { key: "ktn", value: "Kuala Terengganu", text: "Kuala Terengganu" },
    { key: "ht", value: "Hulu Terengganu", text: "Hulu Terengganu" },
  ],
};

const activityOptions = [
  { key: "leisure", value: "Leisure", text: "Leisure" },
  { key: "nature", value: "Nature", text: "Nature" },
  { key: "culture", value: "Culture", text: "Culture" },
];

const CreateTrip = () => {
  const [state, setState] = useState(null);
  const [district, setDistrict] = useState(null);
  const [activity, setActivity] = useState(null);
  const [predictedLocations, setPredictedLocations] = useState([]);
  const [isPredicted, setIsPredicted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const predict = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true); // Start loading

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: state,
          district: district,
          activity: activity,
        }),
      });
      const data = await response.json();

      // Check if the response contains a message
      if (data.message) {
        // If it does, show an alert with the message
        alert(data.message);
      } else {
        // If it doesn't, it's an object, so you can proceed as before
        setPredictedLocations([data]);
        setIsPredicted(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const saveTravel = async () => {
    // Ensure that data exists
    if (predictedLocations.length > 0 && activity && district && state) {
      try {
        // Get current user
        const user = auth.currentUser;
  
        // If user is logged in
        if (user) {
          for (let location of predictedLocations) {
            const docRef = await addDoc(collection(db, "trips"), {
              userId: user.uid, // This links the plan to the user
              state: state,
              district: district,
              activity: activity,
              location: location.location,
              hoursOfOperation: location['hours of operation'],
              estimatedVisitDuration: location['estimated visit duration'],
              costOfVisit: location['cost of visit'],
              typeOfLocation: location['type of location'],
              popularity: location.popularity,
              createdAt: serverTimestamp(),
            });
  
            console.log("Document written with ID: ", docRef.id);
          }
          setSaveSuccess(true); // add this line
  
          setTimeout(() => {
            setSaveSuccess(false); // and this line
          }, 3000);
        } else {
          console.error("No user is signed in.");
        }
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      console.error("No predicted data to save.");
    }
  };  

  return (
    <>
      <Container className="container">
        <div className="home-title">
          <h1>Create your Plan</h1>
        </div>
        <div className="predict">
          <div className="select">
            <Dropdown
              clearable
              placeholder="select state"
              options={stateOptions}
              selection
              onChange={(e, { value }) => {
                setState(value);
                setPredictedLocations([]);
                setIsPredicted(false);
              }}
              className="custom-dropdown"
            />
            <Dropdown
              clearable
              placeholder="select district"
              options={state ? districtOptions[state] : []}
              selection
              onChange={(e, { value }) => {
                setDistrict(value);
                setPredictedLocations([]);
                setIsPredicted(false);
              }}
              className="custom-dropdown"
            />
            <Dropdown
              clearable
              placeholder="select activity"
              options={activityOptions}
              selection
              onChange={(e, { value }) => {
                setActivity(value);
                setPredictedLocations([]);
                setIsPredicted(false);
              }}
              className="custom-dropdown"
            />
          </div>
          <div className="bttn">
            <button
              className="create-button"
              onClick={predict}
              disabled={!state || !district || !activity}
            >
              Go
            </button>
          </div>
          <div className="result">
        {isLoading ? (
          <h2>Loading...</h2>
        ) : predictedLocations.length ? (
          <>
            <h3>
              Your Travel plan for {district}, {state} is
            </h3>
            {predictedLocations.map((location, index) => (
              <div key={index}>
                <h4>
                  Visit {location.location} for {activity} activity
                </h4>
                <p>Hours of Operation: {location['hours of operation']}</p>
                <p>Estimated Visit Duration: {location['estimated visit duration']}</p>
                <p>Cost of Visit (RM): {location['cost of visit']}</p>
                <p>Type of Location: {location['type of location']}</p>
                <p>Popularity: {location.popularity}</p>
              </div>
            ))}
            <button className="create-button" onClick={saveTravel}>
              Save Plan
            </button>
            {saveSuccess && <p>Plan saved successfully!</p>}{" "}
          </>
        ) : null}
      </div>
        </div>

        <div>
          <img src={beijing} alt="beijing" className="bg-img" />
        </div>
      </Container>
    </>
  );
};

export default CreateTrip;
