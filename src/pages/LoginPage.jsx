import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginPage.module.scss";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (email === "admin@gmail.com") {
        navigate("/homeadmin");
      } else {
        navigate("/homeuser");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* LEFT SIDE */}
        <div className={styles.loginLeft}>
          <h1>Welcome back 👋</h1>
          <p className={styles.subtitle}>
            Login to manage your projects and tasks
          </p>

          <div className={styles.loginForm}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              disabled={!email || !password}
            >
              Login
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.loginRight} />
      </div>
    </div>
  );
};

export default LoginPage;
