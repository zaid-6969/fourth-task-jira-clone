import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import styles from "../styles/Register.module.scss";
import { FcGoogle } from "react-icons/fc";

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
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        {/* LEFT SIDE */}
        <div className={styles.registerLeft}>
          <h1>Create account ✨</h1>
          <p className={styles.subtitle}>
            Register to start managing your projects
          </p>

          <div className={styles.registerForm}>
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleRegister}>
              Create account
            </button>
          </div>

          <button
            onClick={handleGoogleRegister}
            className={styles.googleBtn}
          >
            <FcGoogle className={styles.googleIcon} />
            Continue with Google
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className={styles.registerRight} />
      </div>
    </div>
  );
};

export default Register;
