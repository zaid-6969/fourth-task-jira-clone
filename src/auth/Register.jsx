import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

const ADMIN_EMAIL = "admin@gmail.com";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔹 EMAIL REGISTER
  const handleRegister = async () => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", res.user.uid), {
        name,
        email: res.user.email,
        role: res.user.email === ADMIN_EMAIL ? "admin" : "user",
        createdAt: Date.now(),
      });

      alert("User Registered Successfully");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🔹 GOOGLE REGISTER
  const handleGoogleRegister = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);

      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: res.user.displayName,
          email: res.user.email,
          role: res.user.email === ADMIN_EMAIL ? "admin" : "user",
          createdAt: Date.now(),
        });
      }

      navigate("/homeuser");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>
        <button onClick={handleGoogleRegister} className="google-btn">
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Register;
