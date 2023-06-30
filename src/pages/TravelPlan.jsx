import React, { useState, useEffect } from 'react';
import '../App.css';
import { Card, Button, Icon, Divider } from 'semantic-ui-react';
import "../pages/css/TravelPlan.css"
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/Firebase";

const TravelPlan = () => {
  const [data, setData] = useState([]);

  const colors = ['red', 'green', 'blue', 'purple'];

  useEffect(() => {

    const fetchPlans = async (user) => {
      // If user is logged in
      if (user) {
        const q = query(collection(db, 'trips'), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Keep the document id
        setData(fetchedData);
      } else {
        console.error("No user is signed in.");
      }
    };

    const unsubscribe = onAuthStateChanged(getAuth(), user => fetchPlans(user));

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (index) => {
    let newData = [...data];
    const planToDelete = newData.splice(index, 1)[0]; // Get the plan to delete
    
    try {
      // Delete the plan from Firestore
      await deleteDoc(doc(db, 'trips', planToDelete.id));
      console.log(`Deleted plan ${planToDelete.id}`);
    } catch (e) {
      console.error(`Error deleting plan ${planToDelete.id}: `, e);
    }
    
    setData(newData);
  };
  
  return (
    <div>
      <div className="travel-plan-header"><h1>Here's Your Trip</h1></div>
      <div className='ui four column doubling stackable grid container'>
        {data.length ? (
          data.map((item, index) => (
            <div className='column'>
              <Card color={colors[index % colors.length]} className="travel-card" key={index} header="You Plan">
                <Card.Content>
                  <h3>Your Plan is Ready!</h3>
                  <div className="card-header">
                    <Card.Header ><h1>{item.state}</h1></Card.Header>

                  </div>
                  <Card.Description>
                    <h4>Your trip for today</h4>
                    {item.locations.map((location, index) => (
                      <p key={index}>Visit {location}</p>
                    ))}
                  </Card.Description>
                </Card.Content>
                <div className=''>
                <Button className='deleteButton' icon color='red' onClick={() => handleDelete(index)}>
                  <Icon name='trash alternate outline' />
                </Button>
                </div>
              </Card>
            </div>
          ))
        ) : (
        <div className='default-none'>
          <h2>Ooopps..You have no travel plans yet...</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPlan;
