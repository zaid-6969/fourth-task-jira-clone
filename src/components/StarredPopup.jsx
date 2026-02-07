import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";

const StarredPopup = ({ onClose }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadStarred = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      // get starred project IDs
      const starSnap = await getDocs(
        query(collection(db, "starred"), where("userId", "==", user.uid))
      );

      const ids = starSnap.docs.map((d) => d.data().projectId);

      if (ids.length === 0) {
        setProjects([]);
        return;
      }

      // get projects
      const projSnap = await getDocs(collection(db, "projects"));
      const list = projSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => ids.includes(p.id));

      setProjects(list);
    };

    loadStarred();
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="starred-popup">
      <div className="starred-header">
        <h4>Starred</h4>
      </div>

      <div className="starred-search">
        <IoSearch />
        <input
          placeholder="Search starred items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="starred-list">
        {filtered.length === 0 && (
          <p className="starred-empty">No starred items</p>
        )}

        {filtered.map((p) => (
          <div
            key={p.id}
            className="starred-item"
            onClick={() => {
              navigate(`/spaces/${p.id}`);
              onClose();
            }}
          >
            <span className="starred-icon">
              <AiFillStar />
            </span>
            <span className="starred-name">{p.name}</span>
          </div>
        ))}
      </div>

      <div className="starred-footer" onClick={onClose}>
        View all starred items
      </div>
    </div>
  );
};

export default StarredPopup;
