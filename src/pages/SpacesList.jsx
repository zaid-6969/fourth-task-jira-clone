import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/Aside.scss";

const SpacesList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Spaces</h2>

      {projects.map(p => (
        <div
          key={p.id}
          className={`spaces-project ${
            location.pathname === `/spaces/${p.id}`
              ? "spaces-project-active"
              : ""
          }`}
          onClick={() => navigate(`/spaces/${p.id}`)}
        >
          <span className="project-dot" />
          {p.name}
        </div>
      ))}
    </div>
  );
};

export default SpacesList;
