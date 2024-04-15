import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../../components/firebase/FireBase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

export const Signup = () => {
  const [err, setErr] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const userImage = e.target[3].files[0];

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    } else {
      setPasswordError("");
    }

    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Generate a unique filename using user's UID and a timestamp
      const timestamp = new Date().getTime();
      const filename = `userImage_${res.user.uid}_${timestamp}`;

      const storageRef = ref(storage, `userImages/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, userImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress if needed
        },
        (error) => {
          console.error("Error uploading image:", error);
          setErr(true);
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await updateProfile(res.user, {
                displayName: userName,
                photoURL: downloadURL,
              });

              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName: userName,
                email,
                photoURL: downloadURL,
              });

              console.log("Sign up successful. Redirecting to home.");
              navigate("/");
              setLoading(false);
            })
            .catch((downloadError) => {
              console.error("Error getting download URL:", downloadError);
              setErr(true);
              setLoading(false);
            });
        }
      );
    } catch (err) {
      console.error("Error creating user:", err);
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signupLeftSection">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <div>
            <label htmlFor="image">Upload Image:</label>
            <input type="file" id="image" name="image" />
          </div>
          <div className="signupBtn">
            <button type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          If you already have an account,{" "}
          <NavLink to="/Login">log in here</NavLink>.
        </p>
      </div>
      <div className="signupRightSection">
        <img src="./Image/signupImage.jpg" alt="" />
      </div>
    </div>
  );
};
