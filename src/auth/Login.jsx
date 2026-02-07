import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ADMIN_EMAIL = "admin@gmail.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔹 EMAIL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await handleUserData(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserData(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 FIRESTORE + ROLE HANDLING
  const handleUserData = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email,
        role: user.email === ADMIN_EMAIL ? "admin" : "user",
        createdAt: Date.now(),
      });
    }

    if (user.email === ADMIN_EMAIL) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/homeuser", { replace: true });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <button onClick={handleGoogleLogin} className="google-btn">
          Sign up with Google
        </button>

        {/* 🔹 REGISTER BUTTON */}
        <p className="auth-footer">
          Do you have a google account?{" "}
          <Link
            to="/register"
            className="register-link"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
