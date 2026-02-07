import { useEffect, useRef, useState } from "react";
import "../styles/Aside.scss";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  IoPersonCircleOutline,
  IoReorderTwoSharp,
  IoChevronForward,
} from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";
import { RiApps2AddLine } from "react-icons/ri";
import { SiSaturn } from "react-icons/si";
import { FiAlignCenter, FiPlus } from "react-icons/fi";
import { BsGrid1X2 } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { TbAdjustmentsFilled } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";

import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";
import style from "../styles/btn.module.scss";
import StarredPopup from "../components/StarredPopup";

/* ---------------- CREATE SPACE MODAL ---------------- */

const CreateSpaceModal = ({ users, onClose }) => {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      setSelectedUsers([currentUser.uid]);
    }
  }, [currentUser]);

  const toggleUser = (uid) => {
    setSelectedUsers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid],
    );
  };

  const createSpace = async () => {
    if (!name.trim()) return;

    await addDoc(collection(db, "projects"), {
      name,
      createdBy: currentUser.uid,
      assignedUserIds: selectedUsers,
      createdAt: serverTimestamp(),
    });

    onClose();
  };

  return (
    <div className="jira-modal-overlay" onClick={onClose}>
      <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create space</h2>

        <label>Space name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Frontend Team"
        />

        <label>Add members</label>
        <div className="user-list">
          {users.map((u) => (
            <div
              key={u.id}
              className={`user-item ${
                selectedUsers.includes(u.id) ? "selected" : ""
              }`}
              onClick={() => toggleUser(u.id)}
            >
              <span className="avatar">{u.name?.charAt(0)?.toUpperCase()}</span>
              <span>{u.name}</span>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="create" onClick={createSpace}>
            Create space
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- ASIDE BAR ---------------- */

const Asidebar = () => {
  const showBox = useSelector((state) => state.ui.showBox);
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSpacesOpen, setIsSpacesOpen] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [role, setRole] = useState(null);

  const starredRef = useRef(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
      if (snap.exists()) setRole(snap.data().role);
    });
  }, [currentUser]);

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubProjects();
      unsubUsers();
    };
  }, []);

  useEffect(() => {
    if (!currentUser || !role) return;
    setFilteredProjects(
      role === "admin"
        ? projects
        : projects.filter((p) => p.assignedUserIds?.includes(currentUser.uid)),
    );
  }, [projects, role, currentUser]);

  useEffect(() => {
    if (location.pathname.startsWith("/spaces/")) setIsSpacesOpen(true);
  }, [location.pathname]);

  const asideMenu = [
    { icon: <IoPersonCircleOutline />, label: "For you", path: "/homeuser" },
    { icon: <IoMdTime />, label: "Recent", path: "/recent" },
    { icon: <IoIosStarOutline />, label: "Starred" },
    { icon: <RiApps2AddLine />, label: "Apps", path: "/apps" },
    { icon: <IoReorderTwoSharp />, label: "Plans", path: "/plans" },
    { icon: <SiSaturn />, label: "Spaces" },
    { icon: <FiAlignCenter />, label: "Filters", path: "/filters" },
    { icon: <BsGrid1X2 />, label: "Dashboards", path: "/dashboards" },
    { icon: <FaUserFriends />, label: "Teams", path: "/teams" },
    {
      icon: <TbAdjustmentsFilled />,
      label: "Customize sidebar",
      path: "/settings",
    },
  ];

  return (
    <>
      <div className={`aside-container ${showBox ? "open" : "collapsed"}`}>
        <ul className="aside-menu">
          {asideMenu.map((item, index) => {
            const isSpaces = item.label === "Spaces";
            const isStarred = item.label === "Starred";
            const isRecent = item.label === "Recent";
            const isForYou = item.label === "For you";

            return (
              <li key={index} className="aside-item">
                {isSpaces ? (
                  <>
                    <div
                      className={`aside-link space-toggle ${isSpacesOpen ? "open" : ""}`}
                    >
                      <div
                        className={style["aside-list-items-first"]}
                        onClick={(e) => {
                          e.stopPropagation(); // 🔴 ADD THIS LINE
                          setIsSpacesOpen((p) => !p);
                        }}
                      >
                        <span className="icon-wrapper">
                          <span className="icon-normal">{item.icon}</span>
                          <span className="icon-hover">
                            <IoChevronForward />
                          </span>
                        </span>
                        <p>{item.label}</p>
                      </div>

                      {/* actions must NOT toggle */}
                      <span className="end-icon space-actions">
                        <FiPlus
                          className="space-plus"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCreateSpace(true);
                          }}
                        />
                        <BsThreeDots onClick={(e) => e.stopPropagation()} />
                      </span>
                    </div>

                    <ul
                      className={`aside-submenu ${isSpacesOpen ? "open" : ""}`}
                    >
                      {filteredProjects.map((project) => {
                        const isActive =
                          location.pathname === `/spaces/${project.id}`;

                        return (
                          <li
                            key={project.id}
                            className={`aside-sub-item ${
                              isActive ? "aside-project-active" : ""
                            }`}
                            onClick={() => navigate(`/spaces/${project.id}`)}
                          >
                            <span className="project-dot" />
                            {project.name}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : isForYou ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "aside-link active no-hover-swap for-you"
                        : "aside-link no-hover-swap for-you"
                    }
                  >
                    <div className={style["aside-list-items-first"]}>
                      <span className="icon-wrapper">
                        <span className="icon-normal">{item.icon}</span>
                      </span>
                      <p>{item.label}</p>
                    </div>
                  </NavLink>
                ) : isStarred ? (
                  <div
                    className="aside-link no-hover-swap"
                    ref={starredRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStarred((p) => !p);
                    }}
                  >
                    <div className={style["aside-list-items-first"]}>
                      <span className="icon-wrapper">
                        <span className="icon-normal">{item.icon}</span>
                      </span>
                      <p>{item.label}</p>
                    </div>

                    {/* ✅ ALWAYS VISIBLE ARROW */}
                    <span className="end-icon arrow-only">
                      <IoChevronForward />
                    </span>
                  </div>
                ) : isRecent ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "aside-link active no-hover-swap"
                        : "aside-link no-hover-swap"
                    }
                  >
                    <div className={style["aside-list-items-first"]}>
                      <span className="icon-wrapper">
                        <span className="icon-normal">{item.icon}</span>
                      </span>
                      <p>{item.label}</p>
                    </div>

                    {/* ✅ ALWAYS VISIBLE ARROW */}
                    <span className="end-icon arrow-only">
                      <IoChevronForward />
                    </span>
                  </NavLink>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "aside-link active" : "aside-link"
                    }
                  >
                    <div className={style["aside-list-items-first"]}>
                      <span className="icon-wrapper">
                        <span className="icon-normal">{item.icon}</span>
                        <span className="icon-hover">
                          <IoChevronForward />
                        </span>
                      </span>
                      <p>{item.label}</p>
                    </div>

                    <span className="end-icon dots">
                      <BsThreeDots />
                    </span>
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {showCreateSpace && (
        <CreateSpaceModal
          users={users}
          onClose={() => setShowCreateSpace(false)}
        />
      )}
      {showStarred && (
        <StarredPopup
          anchorRef={starredRef}
          onClose={() => setShowStarred(false)}
        />
      )}
    </>
  );
};

export default Asidebar;
