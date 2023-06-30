import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/Firebase';
import { Form, Button, Header, Card  } from 'semantic-ui-react';
import './css/EditUser.css';

function EditUser() {
    const [account, setAccount] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setLoading(false);
            if (user) {
                fetchData(user.uid);
            }
        });
        return unsubscribe;
    }, []);

    async function fetchData(uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setAccount(docSnap.data());
        } else {
            console.log("No such document!");
        }
    }

    async function updateData(uid) {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            username: account.username,
            firstname: account.firstname,
            lastname: account.lastname,
            email: account.email,
        });

        navigate('/account'); // Redirect back to account page after updating
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAccount(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-user">
        <Header as='h1' textAlign='center'>Edit My Account</Header>
        <Card centered>
            <Card.Content>
                <Form className="edit-form">
                    <Form.Field>
                        <label>Username</label>
                        <input placeholder='Username' name="username" value={account.username} onChange={handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>First Name</label>
                        <input placeholder='First Name' name="firstname" value={account.firstname} onChange={handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <input placeholder='Last Name' name="lastname" value={account.lastname} onChange={handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Email</label>
                        <input placeholder='Email' type="email" name="email" value={account.email} onChange={handleChange} disabled/>
                    </Form.Field>
                    <Button type='submit' onClick={() => updateData(auth.currentUser.uid)}>Update</Button>
                </Form>
            </Card.Content>
        </Card>
    </div>
    );
}

export default EditUser;
