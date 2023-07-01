import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../config/Firebase"; // import your Firestore instance
import { Icon, Progress } from "semantic-ui-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "semantic-ui-css/semantic.min.css";
import "./css/Account.css";

function AccountPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [url, setUrl] = useState("");

  const [account, setAccount] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadProgress(0); // Reset upload progress when a new file is chosen
  };

  useEffect(() => {
    const uploadFile = () => {
      if (!file) return;
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const user = auth.currentUser;
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              photoUrl: downloadURL,
            });
            fetchData(user.uid);
            setUploadProgress(0); // Reset upload progress after upload is complete
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="acc-title">
        <h1>My Account</h1>
      </div>

      <div className="single">
        <div className="singleContainer">
          <div className="ui card">
            <div className="top">
              <div className="left">
                <div
                  className="editButton"
                  onClick={() => navigate("/edituser")}
                >
                  Edit
                </div>

                <div className="content">
                  <img
                     src={url || account.photoUrl}
                     alt=""
                     className="itemImg"
                  />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                  />
                  <Icon
                    name="upload"
                    onClick={handleIconClick}
                    style={{ cursor: "pointer", marginTop: "10px" }}
                  />
                  {uploadProgress > 0 && (
                    <Progress percent={uploadProgress} indicating />
                  )}
                </div>
                <div className="details">
                  <h1 className="itemTitle">{account.username}</h1>
                  <div className="detailItem">
                    <span>Firstname: {account.firstname}</span>
                  </div>
                  <div className="detailItem">
                    <span>Lastname: {account.lastname}</span>
                  </div>
                  <div className="detailItem">
                    <span>Email: {account.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
