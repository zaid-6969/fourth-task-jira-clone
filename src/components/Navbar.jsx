import { useEffect, useState, useRef } from "react";
import { FiGrid, FiPlus } from "react-icons/fi";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { IoMdNotificationsOutline, IoMdHelpCircleOutline } from "react-icons/io";
import { LuSettings } from "react-icons/lu";
import { CiSun } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";

import "../styles/app.scss";
import image from "../assets/image/jira.jpg";
import style from "../styles/btn.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { toggleBox } from "../store/uiSlice";
import { toggleModule } from "../store/module";
import { toggleTheme } from "../store/themeSlice";

import Logout from "../auth/Logout";
import { auth } from "../firebase/firebase";
import UserAvatar from "./UserAvatar";

import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();

  /* UI STATE */
  const showBox = useSelector((state) => state.ui.showBox);
  const theme = useSelector((state) => state.theme.mode);

  /* AUTH STATE (Firebase) */
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  /* DROPDOWN STATE */
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await Logout();
  };

  return (
    <>
      <div className="navbar-container">
        {/* LEFT */}
        <ul>
          <button className="togglebtn" onClick={() => dispatch(toggleBox())}>
            <li>{showBox ? <GoSidebarExpand /> : <GoSidebarCollapse />}</li>
          </button>

          <li>
            <FiGrid />
          </li>

          <li className="logo">
            <img src={image} alt="jira" />
            <p>Jira</p>
          </li>
        </ul>

        {/* CENTER */}
        <div className="navbar-center">
          <input placeholder="🔍  Search" type="text" />
          <button
            className="togglebtn"
            onClick={() => dispatch(toggleModule())}
          >
            <FiPlus /> Create
          </button>
        </div>

        {/* RIGHT */}
        <ul>
          <li>
            <IoMdNotificationsOutline />
          </li>
          <li>
            <IoMdHelpCircleOutline />
          </li>
          <li>
            <LuSettings />
          </li>

          {/* THEME + LOGOUT */}
          <selection ref={dropdownRef}>
            <button
              className="profile-theme"
              onClick={() => setOpen((p) => !p)}
            >
              <UserAvatar
              name={
                user?.displayName ||
                user?.email?.charAt(0).toUpperCase() ||
                "U"
              }
            />
            </button>

            {open && (
              <section className="theme-dropdown">
                <div
                  className={style["drop-down-option"]}
                  onClick={handleLogout}
                >
                 <FaUser/>  Logout
                </div>

                <nav
                  className={style["drop-down-option"]}
                  onClick={() => dispatch(toggleTheme())}
                >
                  {theme === "dark" ? <CiSun /> : <FaMoon />} Toggle theme
                </nav>
              </section>
            )}
          </selection>
        </ul>
      </div>

      {/* SEPARATOR */}
      <div className="hr" />
    </>
  );
};

export default Navbar;
