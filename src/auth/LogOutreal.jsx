import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="profile-wrapper" ref={menuRef}>
      {/* PROFILE ICON */}
      <div
        className="profile-icon"
        onClick={() => setOpen((prev) => !prev)}
      >
        {auth.currentUser?.photoURL ? (
          <img
            src={auth.currentUser.photoURL}
            alt="profile"
            className="profile-img"
          />
        ) : (
          <span className="profile-letter">
            {auth.currentUser?.email?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="profile-dropdown">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
